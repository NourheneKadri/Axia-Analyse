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
        public async Task AddTimeSlotsAsync(List<TimeSlots> timeSlots)
        {
            // Créer une liste des créneaux horaires uniques (sans doublon)
            var uniqueTimeSlots = new List<TimeSlots>();

            foreach (var slot in timeSlots)
            {
                // Vérifier si ce créneau existe déjà dans la liste unique
                bool isDuplicate = uniqueTimeSlots.Any(existingSlot =>
                    existingSlot.StartDate == slot.StartDate &&
                    existingSlot.EndDate == slot.EndDate &&
                    existingSlot.RecruiterId == slot.RecruiterId);

                if (!isDuplicate)
                {
                    // Si le créneau est unique, l'ajouter à la liste unique
                    uniqueTimeSlots.Add(slot);
                }
            }

            // Vérifier s'il y a des créneaux uniques à ajouter
            if (uniqueTimeSlots.Any())
            {
                // Assurez-vous que l'ID soit 0 pour que EF puisse le gérer comme un nouvel enregistrement
                foreach (var slot in uniqueTimeSlots)
                {
                    slot.Id = 0;  // ID à 0 pour que l'auto-incrément fonctionne correctement
                }

                // Ajouter les créneaux uniques à la base de données
                await _context.TimeSlots.AddRangeAsync(uniqueTimeSlots);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<List<TimeSlots>> GetSlotsByDateAndRecruiterAsync(DateTime date, int recruiterId)
        {
            return await _context.TimeSlots
                .Where(slot => slot.StartDate.Date == date.Date && slot.RecruiterId == recruiterId)
                .ToListAsync();
        }

    }
}
