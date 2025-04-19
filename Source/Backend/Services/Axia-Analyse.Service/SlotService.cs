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
    }
}
