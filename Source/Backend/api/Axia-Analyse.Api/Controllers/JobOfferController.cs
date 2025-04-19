using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Service;
using Microsoft.AspNetCore.Mvc;
using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Axia_Analyse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class JobOfferController : ControllerBase
    {
        private readonly IJobOfferService _jobOfferServices;

        public JobOfferController(IJobOfferService JobOfferService)
        {
            _jobOfferServices = JobOfferService;
        }

        [HttpGet]
        [Route("{id}")]

        public JobOffer GetById(int id)
        {
            return _jobOfferServices.GetById(id);
        }

        [HttpGet]
        [Authorize]

        public IEnumerable<JobOffer> GetAll()
        {
            return _jobOfferServices.GetAll();
        }

        [HttpGet]
        [Route("delete/{id}")]

        public bool Remove(int id)
        {
            return _jobOfferServices.Remove(id);
        }
        [HttpPost]
        [Route("Add")]

        public bool Add([FromBody] JobOfferDto JobOffer)
        {
            return _jobOfferServices.Add(JobOffer);
        }
        [HttpPost]
        [Route("Update")]

        public bool Update([FromBody] JobOffer JobOffer)
        {

            return _jobOfferServices.Update(JobOffer);
        }
        [HttpGet]
        [Route("search")]

        public async Task<IActionResult> SearchJobOffers(string? title, string? address, int? categoryId)
        {
            var results = await _jobOfferServices.SearchJobOffersAsync(title, address, categoryId);

            if (results.Any())
            {
                return Ok(results);
            }
            else
            {
                return Ok(new { Message = "No job offers found matching the criteria." });
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetJobOffersByCategoryId(int categoryId)
        {
            var jobOffers = await _jobOfferServices.GetJobOffersByCategoryIdAsync(categoryId);

            if (jobOffers == null || !jobOffers.Any())
            {
                return NotFound("No job offers found for this category.");
            }

            return Ok(jobOffers);
        }
        [HttpGet("Type/{jobTypeId}")]
        public async Task<IActionResult> GetJobOffersByTypeId(int jobTypeId)
        {
            var jobOffers = await _jobOfferServices.GetJobOffersByTypeIdAsync(jobTypeId);

            if (jobOffers == null || !jobOffers.Any())
            {
                return NotFound("No job offers found for this Type.");
            }

            return Ok(jobOffers);
        }
        [HttpGet("Recent")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRecentJobOffers()
        {
            var jobOffers = await _jobOfferServices.GetRecentJobsAsyn();

            if (jobOffers == null || !jobOffers.Any())
            {
                return NotFound("No job offers found.");
            }

            return Ok(jobOffers);
        }
        
        [HttpGet("jobcategories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobCategories()
        {
            var categories = await _jobOfferServices.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("jobcategoriescount")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetJobCategorieCount()
        {
            var categoryCounts = await _jobOfferServices.GetJobOffersCountByCategoryAsync();
            return Ok(categoryCounts);
        }
        [HttpGet("countByCompany")]
        [AllowAnonymous]

        public async Task<IActionResult> GetJobOfferCountByCompany()
        {
            var result = await _jobOfferServices.GetJobOfferCountByCompanyAsync();
            return Ok(result);
        }

        [HttpGet("by-user/{userAccountId}")]

        public IActionResult GetJobOffersByUserAccountId(int userAccountId)
        {
            var offers = _jobOfferServices.GetJobOffersByUserAccountId(userAccountId);
            return Ok(offers);
        }


    }
}
