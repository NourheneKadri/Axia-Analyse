using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]

    public class SlotController : ControllerBase
    {
        private readonly ISlotService _slotService;

        public SlotController(ISlotService slotService)
        {
            _slotService = slotService;
        }

        // Créer un slot (disponibilité du recruteur)
        [HttpPost("create")]
        public async Task<IActionResult> CreateSlot([FromBody] SlotDto slot)
        {
            if (slot == null)
            {
                return BadRequest("Le slot ne peut pas être vide.");
            }

            // Vérification de la validité des heures
            if (string.IsNullOrEmpty(slot.StartTime) || string.IsNullOrEmpty(slot.EndTime))
            {
                return BadRequest("Les horaires de début et de fin sont requis.");
            }

            // Tentative de conversion des heures au format TimeOnly
            if (!TimeOnly.TryParse(slot.StartTime, out var startTime))
            {
                return BadRequest("Le format de l'heure de début est invalide. Format attendu : HH:mm:ss.");
            }

            if (!TimeOnly.TryParse(slot.EndTime, out var endTime))
            {
                return BadRequest("Le format de l'heure de fin est invalide. Format attendu : HH:mm:ss.");
            }

            // Créer un nouvel objet Slot avec les valeurs converties et transmettre au service
            var slotEntity = new Slot
            {
                SlotDate = slot.SlotDate,
                StartTime = startTime,
                EndTime = endTime,
                IsAvailable = true,
                RecruiterId = slot.RecruiterId,
                CreatedAt = DateTime.UtcNow // Date de création en UTC
            };

            // Appel au service pour créer le slot
            await _slotService.CreateSlotAsync(slotEntity);

            // Retourner une réponse positive
            return Ok(new { message = "Slot créé avec succès." });
        }


        // Obtenir tous les slots disponibles
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var slots = await _slotService.GetAvailableSlotsAsync();
            return Ok(slots);
        }

        // Obtenir tous les slots d’un recruteur spécifique
        [HttpGet("recruiter/{recruiterId}")]
        public async Task<IActionResult> GetSlotsByRecruiter(int recruiterId)
        {
            var slots = await _slotService.GetSlotsByRecruiterAsync(recruiterId);
            return Ok(slots);
        }

        // Mettre à jour un slot
        [HttpPut("update")]
        public async Task<IActionResult> UpdateSlot([FromBody] Slot slot)
        {
            if (slot == null)
                return BadRequest("Slot invalide.");

            await _slotService.UpdateSlotAsync(slot);
            return Ok(new { message = "Slot mis à jour avec succès." });
        }

        // Supprimer un slot
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSlot(int id)
        {
            await _slotService.DeleteSlotAsync(id);
            return Ok(new { message = "Slot supprimé avec succès." });
        }
        [HttpGet("reserved")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReservedSlots(int recruiterId, DateTime date)
        {
            var slots = await _slotService.GetReservedSlotsAsync(recruiterId, date);

            // Retourner tous les attributs du slot
            var result = slots.Select(s => new {
                s.Id,                  
                s.SlotDate,              
                s.StartTime,            
                s.EndTime,               
                s.IsAvailable,           // Par exemple, ajouter la disponibilité du créneau
                s.RecruiterId       // Ajouter d'autres colonnes si nécessaire
            });

            return Ok(result);
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateTimeSlots([FromBody] TimeSlotGenerationRequest request)
        {
            var startDateTime = request.StartDate.Date + request.StartTime.ToTimeSpan();
            var endDateTime = request.EndDate.Date + request.EndTime.ToTimeSpan();

            if (startDateTime >= endDateTime)
            {
                return BadRequest(new { message = "La date et l'heure de fin doivent être après celles de début" });
            }

            var slots = await _slotService.GenerateTimeSlotsAsync(request);
            return Ok(slots);
        }


        [HttpGet("GetByDateAndRecruiter")]
        public async Task<IActionResult> GetByDateAndRecruiter(DateTime date, int recruiterId)
        {
            var slots = await _slotService.GetSlotsByDateAndRecruiterAsync(date, recruiterId);
            return Ok(slots);
        }

    }
}
