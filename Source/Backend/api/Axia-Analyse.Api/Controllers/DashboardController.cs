using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{
    
        [ApiController]
        [Route("api/[controller]")]
        [AllowAnonymous]  // Permet l'accès public à tous les endpoints de ce contrôleur

    public class DashboardController : ControllerBase
        {
            private readonly IDashboardService _dashboardService;

            public DashboardController(IDashboardService dashboardService)
            {
                _dashboardService = dashboardService;
            }

            [HttpGet("total-jobs")]
            public async Task<IActionResult> GetTotalJobs()
            {
                var totalJobs = await _dashboardService.GetTotalJobsAsync();
                return Ok(new { TotalJobs = totalJobs });
            }

            [HttpGet("active-jobs")]
            public async Task<IActionResult> GetActiveJobs()
            {
                var activeJobs = await _dashboardService.GetActiveJobsAsync();
                return Ok(new { ActiveJobs = activeJobs });
            }

            [HttpGet("jobs-by-category")]
            public async Task<IActionResult> GetJobsByCategory()
            {
                var jobsByCategory = await _dashboardService.GetJobsByCategoryAsync();
                return Ok(jobsByCategory);
            }

            [HttpGet("monthly-applications")]
            public async Task<IActionResult> GetMonthlyApplicationsTrend()
            {
                var trend = await _dashboardService.GetMonthlyApplicationsTrendAsync();
                return Ok(trend);
            }
        [HttpGet("weekly-jobs")]
        public async Task<IActionResult> GetWeeklyJobs()
        {
            var weeklyJobs = await _dashboardService.GetWeeklyJobsAsync();
            return Ok(weeklyJobs);
        }
    }
    }

