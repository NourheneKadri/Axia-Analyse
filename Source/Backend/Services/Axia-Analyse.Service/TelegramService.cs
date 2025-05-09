using Axia_Analyse.Service.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class TelegramService : ITelegramService
    {
        private readonly HttpClient _httpClient;
        private readonly string _botToken;
        private readonly string _apiUrl;

        public TelegramService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _botToken = config["TelegramBotToken"];
            _apiUrl = $"https://api.telegram.org/bot{_botToken}/";
        }

        public async Task<string> SendMessageAsync(string chatId, string message)
        {
            var url = $"{_apiUrl}sendMessage";

            var payload = new
            {
                chat_id = chatId,
                text = message
            };

            var json = JsonSerializer.Serialize(payload);
            var data = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, data);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // Log ou gestion d'erreur si besoin
                throw new HttpRequestException($"Telegram API error: {response.StatusCode} - {responseContent}");
            }

            return responseContent;
        }

        public async Task SetWebhookAsync()
        {
            // URL de votre webhook (remplacez-le par l'URL de votre API locale)
            var webhookUrl = "http://localhost:5259/api/telegram/webhook";  // URL de votre serveur local

            // Assurez-vous que l'URL est correctement encodée pour éviter des problèmes avec les caractères spéciaux
            var encodedWebhookUrl = Uri.EscapeDataString(webhookUrl);

            // Construire l'URL pour définir le webhook
            var url = $"https://api.telegram.org/bot{_botToken}/setWebhook?url={encodedWebhookUrl}";

            try
            {
                // Envoyer la demande pour définir le webhook
                var response = await _httpClient.GetStringAsync(url);

                // Afficher la réponse du serveur Telegram
                Console.WriteLine(response);
            }
            catch (Exception ex)
            {
                // Gérer les erreurs
                Console.WriteLine($"Erreur lors de la configuration du webhook : {ex.Message}");
            }
        }


    }
}
