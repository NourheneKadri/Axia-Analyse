using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{

    [Route("[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class GoogleEventApiController : Controller
    {
        private readonly ItokenService _tokenService;
        private readonly IMeetingService _meetingService;
        public GoogleEventApiController(ItokenService tokenService , IMeetingService meetingService) { 
            _tokenService = tokenService;
            _meetingService = meetingService;
        }


        [HttpGet("token")]
        public async Task<string> GetAccessTokenAsync()
        {
            return await _tokenService.GetAccessToken();

        }
        [HttpPost("create")]
        public async Task<EventResponse> CreateEventAsync(EventRequest eventRequest)
        {

            if (eventRequest == null)
            {
                throw new ArgumentNullException(nameof(eventRequest), "EventRequest cannot be null.");
            }

            if (eventRequest.Start == null || eventRequest.End == null)
            {
                throw new ArgumentNullException("Start and End times must be provided.");
            }

            return await _meetingService.CreateEvent(eventRequest);

        }

    }
}
