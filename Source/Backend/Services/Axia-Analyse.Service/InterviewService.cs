using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
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


        public InterviewService(IInterviewRepository interviewRepository, ISlotRepository slotRepository)
        {
            _interviewRepository = interviewRepository;
            _slotRepository = slotRepository;
        }

        public async Task CreateInterviewAsync(InterviewDto interviewDto)
        {
            var slot = await _slotRepository.GetSlotByIdAsync(interviewDto.SlotId);
            if (slot == null || slot.IsAvailable==false || slot.RecruiterId != interviewDto.recruiterId)
            {
                throw new InvalidOperationException("Le créneau sélectionné n'est plus disponible.");
            }

            var interviw = new Interview
            {

              
                CandidateId = interviewDto.CandidateId,
                SlotId = interviewDto.SlotId,
                RecruiterId = interviewDto.recruiterId,
                JobId = interviewDto.JobId,
                InterviewDate = interviewDto.InterviewDate,
                InterviewTime = interviewDto.InterviewTime,
                Location = interviewDto.Location,
                StatusId = 1,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,


            };


            await _interviewRepository.CreateInterviewAsync(interviw);
            slot.IsAvailable = false;
            await _slotRepository.UpdateSlotAsync(slot);
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
