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
        {
            return await _context.JobOffer
                .Where(j => j.DeleteTimestamp == null) // Compter uniquement les emplois non supprimés
                .CountAsync();
        }


        public async Task<int> GetActiveJobsAsync()
        {
            var currentDate = DateTime.Now;
            return await _context.JobOffer
                .CountAsync(j => j.DeadlineTimestamp >= currentDate);
        }

        public async Task<IEnumerable<dynamic>> GetJobsByCategoryAsync()
        {
            return await _context.JobOffer
                   .Where(j => j.DeleteTimestamp == null) // Filtrer d'abord les emplois non supprimés
                  .GroupBy(j => j.CategorieId)  // Ensure all job offers in the group are not deleted
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
                .Where(j => j.DeleteTimestamp == null)
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

        public async Task<List<Dictionary<string, int>>> GetVisitsByMonth()
        {
            // Récupérer les données groupées par mois et rôle
            var groupedData = await _context.UserAccount
                .GroupBy(u => new { u.Timestamp.Month, u.AppRoleId })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    AppRoleId = g.Key.AppRoleId,
                    Count = g.Count()
                })
                .ToListAsync();

            // Mapper les données en fonction des rôles (Recruteur, Candidat)
            var result = groupedData
                .GroupBy(g => g.Month)
                .Select(g =>
                {
                    var dict = new Dictionary<string, int> { { "Month", g.Key } };

                    // Ajouter un libellé basé sur le rôle
                    foreach (var item in g)
                    {
                        string roleName = item.AppRoleId switch
                        {
                            2 => "Recruteur", // Si le rôle est 2, c'est un recruteur
                            3 => "Candidat",  // Si le rôle est 3, c'est un candidat
                            _ => $"Role_{item.AppRoleId}" // Sinon, utiliser l'ID du rôle directement
                        };

                        dict[roleName] = item.Count; // Ajouter le rôle et le nombre de visites
                    }

                    return dict;
                })
                .OrderBy(v => v["Month"]) // Tri par mois
                .ToList();

            return result;
        }
        public async Task<List<Dictionary<string, int>>> GetUsersByMonth()
        {
            // Récupérer les utilisateurs groupés par mois et année
            var groupedData = await _context.UserAccount
                .GroupBy(u => new { u.Timestamp.Year, u.Timestamp.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UserCount = g.Count() // Nombre d'utilisateurs pour chaque mois
                })
                .ToListAsync();

            // Créer la liste de dictionnaires avec les résultats
            var result = groupedData
                .Select(g => new Dictionary<string, int>
                {
            { "Year", g.Year },
            { "Month", g.Month },
            { "UserCount", g.UserCount }
                })
                .OrderBy(v => v["Year"]) // Tri par année
                .ThenBy(v => v["Month"]) // Tri par mois
                .ToList();

            return result;
        }


    }
}
