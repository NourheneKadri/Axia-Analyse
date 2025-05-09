using Axia_Analyse.Service;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Axia_Analyse.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TelegramController : ControllerBase
    {
        private readonly ITelegramService _telegramService;
        private readonly string _telegramBotToken;


        public TelegramController(ITelegramService telegramService, IConfiguration config)
        {
            _telegramService = telegramService;
            _telegramBotToken = config["TelegramBotToken"];
        }
        [AllowAnonymous]
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] TelegramMessageDto dto)
        {
            await _telegramService.SendMessageAsync(dto.ChatId, dto.Message);
            return Ok("Message envoyé !");
        }

        [AllowAnonymous]
        [HttpPost("webhook")]
        public IActionResult Webhook([FromBody] TelegramUpdate update)
        {
       

            // Traitement des messages entrants
            if (update?.Message != null)
            {
                var messageText = update.Message.Text;
                var chatId = update.Message.ChatId;

                // Répondre automatiquement selon le message reçu
                if (messageText.Contains("bonjour", StringComparison.OrdinalIgnoreCase))
                {
                    _telegramService.SendMessageAsync(chatId.ToString(), "Bonjour ! Comment puis-je vous aider ?");
                }
                else
                {
                    _telegramService.SendMessageAsync(chatId.ToString(), "Je n'ai pas compris votre message. Essayez 'bonjour'.");
                }
            }

            return Ok();  // Réponse pour accuser réception de l'update
        }

    }

  
}
