using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IDashboardService
    {
        Task<int> GetTotalJobsAsync();
        Task<int> GetActiveJobsAsync();
        Task<IEnumerable<dynamic>> GetJobsByCategoryAsync();
        Task<IEnumerable<dynamic>> GetMonthlyApplicationsTrendAsync();
        Task<IEnumerable<dynamic>> GetWeeklyJobsAsync();
        Task<object> GetWebsiteVisitsStatistics();
        Task<List<Dictionary<string, int>>> GetUsersByMonth();
    }
}
