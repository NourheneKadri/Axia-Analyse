using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Repositories
{
    public class SlotRepository : ISlotRepository
    {
        private readonly AxiaDbContext _context;

        public SlotRepository(AxiaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Slot>> GetAvailableSlotsAsync()
        {
            return await _context.Slot.Where(s => s.IsAvailable).ToListAsync();
        }

        public async Task<Slot> GetSlotByIdAsync(int slotId)
        {
            return await _context.Slot.FindAsync(slotId);
        }

        public async Task CreateSlotAsync(Slot slot)
        {
            _context.Slot.Add(slot);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSlotAsync(Slot slot)
        {
            _context.Slot.Update(slot);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSlotAsync(int slotId)
        {
            var slot = await GetSlotByIdAsync(slotId);
            if (slot != null)
            {
                _context.Slot.Remove(slot);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Slot>> GetSlotsByRecruiterAsync(int recruiterId)
        {
            return await _context.Slot
                .Where(s => s.RecruiterId == recruiterId)
                .ToListAsync();
        }
        public async Task<List<Slot>> GetReservedSlotsByRecruiterAsync(int recruiterId, DateTime date)
        {
            return await _context.Slot
                .Where(s => s.RecruiterId == recruiterId && s.SlotDate.Date == date.Date)
                .ToListAsync();
        }
    }
}
