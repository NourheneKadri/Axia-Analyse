using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<int> GetTotalJobsAsync()
        {
            return await _dashboardRepository.GetTotalJobsAsync();
        }

        public async Task<int> GetActiveJobsAsync()
        {
            return await _dashboardRepository.GetActiveJobsAsync();
        }

        public async Task<IEnumerable<dynamic>> GetJobsByCategoryAsync()
        {
            return await _dashboardRepository.GetJobsByCategoryAsync();
        }

        public async Task<IEnumerable<dynamic>> GetMonthlyApplicationsTrendAsync()
        {
            return await _dashboardRepository.GetMonthlyApplicationsTrendAsync();
        }
        
        public async Task<IEnumerable<dynamic>> GetWeeklyJobsAsync()
        {
            return await _dashboardRepository.GetWeeklyJobsAsync();
        }
    }



}

