using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Axia_Analyse.Service;
using Axia_Analyse.Data.Interface.Entites;
using CloudinaryDotNet;

namespace Axia_Analyse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]  // Permet l'accès anonyme à toutes les actions de ce contrôleur
    public class JobOfferCandidancyController : ControllerBase
    {
        private readonly IJobOfferCandidancyService _jobOfferCandidancyService;
        private readonly IJobOfferService _jobOfferService;
        private readonly PdfService _pdfService;
        private readonly GeminiService _geminiService;
        private readonly MailNotificationService _mailNotificationService;

        private readonly CloudinaryService _cloudinaryService;

        public JobOfferCandidancyController(IJobOfferCandidancyService jobOfferCandidancyService, CloudinaryService cloudinaryService, IJobOfferService 
            jobOfferService,PdfService pdfService, GeminiService geminiService,MailNotificationService mailNotificationService )
        {
            _jobOfferCandidancyService = jobOfferCandidancyService;
            _cloudinaryService = cloudinaryService;
            _jobOfferService = jobOfferService;
            _pdfService = pdfService;
            _geminiService = geminiService;
            _mailNotificationService = mailNotificationService;
        }

        // Get by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var candidacy = await _jobOfferCandidancyService.GetByIdAsync(id);

            if (candidacy == null)
            {
                return NotFound(new { message = "Candidature non trouvée" });
            }

            return Ok(candidacy);
        }

        // Get All Candidacies
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var candidacies = await _jobOfferCandidancyService.GetAllAsync();

            return Ok(candidacies);
        }

        // Add new Candidacy
        [HttpPost]

        public async Task<bool> AddAsync([FromForm] JobOfferCandidancyDto dto)
        {
            try
            {
                // Vérification si un fichier CV est présent
                if (dto.CV != null)
                {
                    // Appel du service Cloudinary pour télécharger le CV
                    var cvUrl = await _cloudinaryService.UploadCVAsync(dto.CV);

                    // Enregistrer l'URL du CV dans le DTO
                    dto.CVurl = cvUrl;
                }

                // Ajout de la candidature avec l'URL du CV
               

                var jobOffer =  _jobOfferService.GetById(dto.JobOfferId);
                if (jobOffer == null)
                {
                    return false;
                }

                string cvText = await _pdfService.ExtractTextFromPdf( dto.CVurl);

                if (jobOffer != null)
                {
                    // Appel à l'API Gemini
                    var matchingScore = await _geminiService.GetMatchingScoreAsync(cvText, jobOffer.Description);

                    // Afficher le score dans la console (test)
                    Console.WriteLine($"Matching Score: {matchingScore}");
                    dto.score= matchingScore;


                    // OU : Retourner directement le score pour le tester dans Postman
                     // Ex: Considérer >5 comme une bonne correspondance
                }

                await _jobOfferCandidancyService.AddAsync(dto);

                return true;
            }
            catch (InvalidOperationException ex)
            {
                return false;
            }
        }

        // Update Candidacy
        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsync([FromBody] JobOfferCandidancy dto)
        {

            await _jobOfferCandidancyService.UpdateAsync(dto);
            bool isAccepted = dto.StatusId == 5;

            if (dto.StatusId == 5 || dto.StatusId == 6)
            {
                // Envoyez une notification par e-mail au candidat
                await _mailNotificationService.NotifyCandidateAsync(dto.CandidateProfileId, isAccepted);
            }

            return Ok();
        }

        // Delete Candidacy
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            try
            {
                await _jobOfferCandidancyService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Candidature non trouvée" });
            }
        }

        // Get candidate profiles by job offer ID
        [HttpGet("jobOffer/{jobOfferId}/candidates")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCandidateProfilesByJobOfferId(int jobOfferId)
        {
            var candidates = await _jobOfferCandidancyService.GetCandidateProfilesByJobOfferId(jobOfferId);
            return Ok(candidates);
        }

        // Get sorted candidacies (e.g., by submission date or status)
        [HttpGet("sorted")]
        public async Task<IActionResult> GetSortedCandidacies([FromQuery] string sortBy)
        {
            var sortedCandidacies = await _jobOfferCandidancyService.GetSortedCandidaturesAsync(sortBy);
            return Ok(sortedCandidacies);
        }

        // Update the status of a candidacy
        [HttpPatch("updateStatus")]
        public async Task<IActionResult> UpdateCandidacyStatusAsync([FromQuery] int candidateId, [FromQuery] int jobOfferId, [FromQuery] int statusId)
        {
            bool result = await _jobOfferCandidancyService.UpdateCandidacyStatusAsync(candidateId, jobOfferId, statusId);

            if (!result)
            {
                return NotFound(new { message = "Candidature non trouvée ou mise à jour échouée" });
            }

            return NoContent();
        }
        [HttpGet("user/{userAccountId}")]
        public async Task<IActionResult> GetCandidaciesByUserAccountId(int userAccountId)
        {
            var candidacies = await _jobOfferCandidancyService.GetCandidaciesByUserAccountIdAsync(userAccountId);

            if (candidacies == null)
            {
                return NotFound("Aucune candidature trouvée pour cet utilisateur.");
            }

            return Ok(candidacies);
        }
    }
}
