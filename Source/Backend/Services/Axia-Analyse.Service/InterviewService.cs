using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Google.Apis.Calendar.v3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly ISlotRepository _slotRepository;
        private readonly IJobOfferService _jobOfferService;
        private readonly IAuthentificationService _authentificationService;
        private readonly IMeetingService _meetingService;




        public InterviewService(IInterviewRepository interviewRepository, ISlotRepository slotRepository, IJobOfferService jobOfferService, IAuthentificationService authentificationService, IMeetingService meetingService)
        {
            _interviewRepository = interviewRepository;
            _slotRepository = slotRepository;
            _jobOfferService = jobOfferService;
            _authentificationService = authentificationService;
            _meetingService = meetingService;
        }

        public async Task CreateInterviewAsync(InterviewDto interviewDto)
        {
            var slot = await _slotRepository.GetSlotByIdAsync(interviewDto.SlotId);
            if (slot == null || slot.IsAvailable==false || slot.RecruiterId != interviewDto.recruiterId)
            {
                throw new InvalidOperationException("Le créneau sélectionné n'est plus disponible.");
            }
            var interviewDateTime = interviewDto.InterviewDate.Date.Add(interviewDto.InterviewTime.ToTimeSpan());


            var interviw = new Interview
            {

              
                CandidateId = interviewDto.CandidateId,
                SlotId = interviewDto.SlotId,
                RecruiterId = interviewDto.recruiterId,
                JobId = interviewDto.JobId,
                InterviewDate = interviewDto.InterviewDate,
                InterviewTime = interviewDateTime,
                Location = interviewDto.Location,
                StatusId = 1,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,


            };



            await _interviewRepository.CreateInterviewAsync(interviw);
            slot.IsAvailable = false;
            await _slotRepository.UpdateSlotAsync(slot);
        }

        public async Task<string?> CreateInterviewWithMeetLink(InterviewDto interview)
        {
            var candidate = await _authentificationService.GetUserAccountByIdAsync(interview.CandidateId);
            var recruteur = await _authentificationService.GetUserAccountByIdAsync(interview.recruiterId);

            // Construction de l'objet EventRequest
            var eventRequest = new EventRequest
            {
                Summary = "Entretien - Poste : " + interview.JobId,
                Location = interview.Location,
                Description = "Entretien programmé entre recruteur et candidat",
                Start = new EventRequest.EventTime
                {
                    DateTime = interview.InterviewDate.Add(interview.InterviewTime.ToTimeSpan()),
                    TimeZone = "Europe/Paris"
                },
                End = new EventRequest.EventTime
                {
                    DateTime = interview.InterviewDate.Add(interview.InterviewTime.ToTimeSpan()).AddMinutes(30),
                    TimeZone = "Europe/Paris"
                },
                Attendees = new[]
                {
            new EventRequest.EventAttendee { Email = candidate.Email },
            new EventRequest.EventAttendee { Email = recruteur.Email }
        },
                
            };

            // Appel à ta méthode centralisée
            var response = await _meetingService.CreateEvent(eventRequest);

            return response?.GoogleMeetLink;
        }


        public async Task<Interview> GetInterviewByIdAsync(int interviewId)
        {
            return await _interviewRepository.GetInterviewByIdAsync(interviewId);
        }

        public async Task UpdateInterviewAsync(Interview interview)
        {
            // Logique métier avant la mise à jour
            await _interviewRepository.UpdateInterviewAsync(interview);
        }

        public async Task DeleteInterviewAsync(int interviewId)
        {
            await _interviewRepository.DeleteInterviewAsync(interviewId);
        }
        public async Task<IEnumerable<Interview>> GetAllInterviewsAsync()
        {
            return await _interviewRepository.GetAllInterviewsAsync();
        }
    }
}
