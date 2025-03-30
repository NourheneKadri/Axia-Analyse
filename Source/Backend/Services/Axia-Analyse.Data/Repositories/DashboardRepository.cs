using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AxiaDbContext _context;

        public DashboardRepository(AxiaDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalJobsAsync()
             => await _context.JobOffer.CountAsync();

        public async Task<int> GetActiveJobsAsync()
        {
            var currentDate = DateTime.Now;
            return await _context.JobOffer
                .CountAsync(j => j.DeadlineTimestamp >= currentDate);
        }

        public async Task<IEnumerable<dynamic>> GetJobsByCategoryAsync()
        {
            return await _context.JobOffer
                .GroupBy(j => j.CategorieId)
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count()
                })
                .ToListAsync<dynamic>(); // Cast to dynamic
        }

        public async Task<IEnumerable<dynamic>> GetMonthlyApplicationsTrendAsync()
        {
            return await _context.JobOfferCandidancy
                .GroupBy(a => new { a.SubmissionDate.Year, a.SubmissionDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(t => t.Year)
                .ThenBy(t => t.Month)
                .ToListAsync<dynamic>(); // Cast to dynamic
        }
        public async Task<IEnumerable<dynamic>> GetWeeklyJobsAsync()
        {
            var jobs = _context.JobOffer
                .AsEnumerable() // Déplace l'évaluation côté client
                .GroupBy(j => GetWeekOfYear(j.Timestamp)) // Utilise GetWeekOfYear côté client
                .Select(g => new
                {
                    Week = g.Key,
                    JobCount = g.Count()
                })
                .OrderBy(w => w.Week) // Tri par semaine
                .ToList(); // Utilise ToList au lieu de ToListAsync

            return jobs;
        }

        // Méthode pour obtenir la semaine de l'année
        public static int GetWeekOfYear(DateTime date)
        {
            var calendar = System.Globalization.CultureInfo.InvariantCulture.Calendar;
            return calendar.GetWeekOfYear(date, System.Globalization.CalendarWeekRule.FirstDay, DayOfWeek.Monday);
        }
    }
}
