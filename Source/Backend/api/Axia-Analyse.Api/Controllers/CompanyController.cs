using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]

    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly CloudinaryService _cloudinaryService;


        public CompaniesController(ICompanyService companyService, CloudinaryService cloudinaryService)
        {
            _companyService = companyService;
            _cloudinaryService = cloudinaryService;
        }

        // POST: api/companies
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Company>> CreateCompany([FromForm] CompanyDto company)
        {
            // Check if Logo is present in the request
            if (company.Logo != null)
            {
                // Call the Cloudinary service to upload the logo
                var cvUrl = await _cloudinaryService.UploadFileAsync(company.Logo);

                // Store the uploaded logo URL in the LogoUrl field of the DTO
                company.LogoUrl = cvUrl;
            }

            // Create the company using the service, passing the DTO
            var createdCompany = await _companyService.CreateCompanyAsync(company);

            // Return the company details, now including the LogoUrl
            return Ok(createdCompany);
        }
        // GET: api/companies
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Company>>> GetAllCompanies()
        {
            var companies = await _companyService.GetAllCompaniesAsync();
            return Ok(companies);
        }

        // GET: api/companies/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]

        public async Task<ActionResult<Company>> GetCompanyById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }

        // PUT: api/companies/{id}
        [HttpPut("{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> UpdateCompany(int id, Company company)
        {
            if (id != company.Id)
            {
                return BadRequest();
            }

            await _companyService.UpdateCompanyAsync(company);
            return NoContent();
        }

        // DELETE: api/companies/{id}
        [HttpDelete("{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> DeleteCompany(int id)
        {
            var result = await _companyService.DeleteCompanyAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
