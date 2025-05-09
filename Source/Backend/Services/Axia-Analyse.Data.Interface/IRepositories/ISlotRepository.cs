using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface ISlotRepository
    {
        Task<List<Slot>> GetAvailableSlotsAsync();
        Task<Slot> GetSlotByIdAsync(int slotId);
        Task CreateSlotAsync(Slot slot);
        Task UpdateSlotAsync(Slot slot);
        Task DeleteSlotAsync(int slotId);
        Task<List<Slot>> GetSlotsByRecruiterAsync(int recruiterId);
       
        Task<List<Slot>> GetReservedSlotsByRecruiterAsync(int recruiterId, DateTime date);
        Task AddTimeSlotsAsync(List<TimeSlots> timeSlots);
        Task<List<TimeSlots>> GetSlotsByDateAndRecruiterAsync(DateTime date, int recruiterId);





    }
}
