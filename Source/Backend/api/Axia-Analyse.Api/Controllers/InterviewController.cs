using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateInterview([FromBody] Interview interview)
        {
            if (interview == null)
            {
                return BadRequest("L'entretien ne peut pas être nul.");
            }

            await _interviewService.CreateInterviewAsync(interview);
            return Ok(new { message = "Entretien créé avec succès." });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInterview(int id)
        {
            var interview = await _interviewService.GetInterviewByIdAsync(id);
            if (interview == null)
            {
                return NotFound("Entretien non trouvé.");
            }

            return Ok(interview);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateInterview([FromBody] Interview interview)
        {
            if (interview == null)
            {
                return BadRequest("L'entretien ne peut pas être nul.");
            }

            await _interviewService.UpdateInterviewAsync(interview);
            return Ok(new { message = "Entretien mis à jour avec succès." });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteInterview(int id)
        {
            await _interviewService.DeleteInterviewAsync(id);
            return Ok(new { message = "Entretien supprimé avec succès." });
        }
    }
}
