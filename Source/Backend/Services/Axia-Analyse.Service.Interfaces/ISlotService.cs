using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface ISlotService
    {
        Task<List<Slot>> GetAvailableSlotsAsync();
        Task<Slot> GetSlotByIdAsync(int slotId);
        Task CreateSlotAsync(Slot slot);
        Task UpdateSlotAsync(Slot slot);
        Task DeleteSlotAsync(int slotId);
        Task<List<Slot>> GetSlotsByRecruiterAsync(int recruiterId);
        Task<List<Slot>> GetReservedSlotsAsync(int recruiterId, DateTime date);
        Task<List<TimeSlots>> GenerateTimeSlotsAsync(TimeSlotGenerationRequest request);
        Task SaveGeneratedTimeSlotsAsync(List<TimeSlots> timeSlots);
        Task<List<TimeSlots>> GetSlotsByDateAndRecruiterAsync(DateTime date, int recruiterId);



    }
}
