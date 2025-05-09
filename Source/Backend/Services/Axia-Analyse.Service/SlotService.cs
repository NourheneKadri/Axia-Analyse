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
    public class SlotService : ISlotService
    {
        private readonly ISlotRepository _slotRepository;

        public SlotService(ISlotRepository slotRepository)
        {
            _slotRepository = slotRepository;
        }

        public async Task<List<Slot>> GetAvailableSlotsAsync()
        {
            return await _slotRepository.GetAvailableSlotsAsync();
        }

        public async Task<Slot> GetSlotByIdAsync(int slotId)
        {
            return await _slotRepository.GetSlotByIdAsync(slotId);
        }

        public async Task CreateSlotAsync(Slot slot)
        {
           
            await _slotRepository.CreateSlotAsync(slot);
        }

        public async Task UpdateSlotAsync(Slot slot)
        {
            await _slotRepository.UpdateSlotAsync(slot);
        }

        public async Task DeleteSlotAsync(int slotId)
        {
            await _slotRepository.DeleteSlotAsync(slotId);
        }
        public async Task<List<Slot>> GetSlotsByRecruiterAsync(int recruiterId)
        {
            return await _slotRepository.GetSlotsByRecruiterAsync(recruiterId);
        }
       
        public async Task<List<Slot>> GetReservedSlotsAsync(int recruiterId, DateTime date)
        {
            return await _slotRepository.GetReservedSlotsByRecruiterAsync(recruiterId, date);
        }
        public async Task<List<TimeSlots>> GenerateTimeSlotsAsync(TimeSlotGenerationRequest request)
        {
            List<TimeSlots> timeSlots = new List<TimeSlots>();

            // On parcourt chaque jour entre StartDate et EndDate
            for (DateTime date = request.StartDate.Date; date <= request.EndDate.Date; date = date.AddDays(1))
            {
                // Convertir StartTime en DateTime pour chaque jour
                DateTime currentStart = date.Add(request.StartTime.ToTimeSpan());
                DateTime endLimit = date.Add(request.EndTime.ToTimeSpan());

                // Vérifier si currentStart et endLimit sont distincts avant de générer des créneaux
                if (currentStart < endLimit)
                {
                    // Générer des créneaux horaires entre currentStart et endLimit
                    while (currentStart.AddMinutes(request.InterviewDurationMinutes) <= endLimit)
                    {
                        timeSlots.Add(new TimeSlots
                        {
                            StartDate = currentStart,
                            EndDate = currentStart.AddMinutes(request.InterviewDurationMinutes),
                            RecruiterId = request.RecruiterId
                        });

                        // Incrémenter currentStart pour le prochain créneau
                        currentStart = currentStart.AddMinutes(request.InterviewDurationMinutes);
                    }
                }
            }

            // Enregistrer les créneaux horaires dans la base de données via le repository
            await _slotRepository.AddTimeSlotsAsync(timeSlots);

            return timeSlots;
        }



        public async Task SaveGeneratedTimeSlotsAsync(List<TimeSlots> timeSlots)
        {
            await _slotRepository.AddTimeSlotsAsync(timeSlots);
        }
        public async Task<List<TimeSlots>> GetSlotsByDateAndRecruiterAsync(DateTime date, int recruiterId)
        {
            return await _slotRepository.GetSlotsByDateAndRecruiterAsync(date, recruiterId);
        }
    }
}
