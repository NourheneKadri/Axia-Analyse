using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class GeminiService
{
    private static readonly string apiKey = "AIzaSyDcmjJFXy1TH1iHu6A9UhjO-7ADWPmWLfM";  // Remplace avec ta clé API
    private static readonly string apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public async Task<string> GetMatchingScoreAsync(string cvText, string jobDescription)
    {
        using (HttpClient client = new HttpClient())
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = $"Donne uniquement un percentage % de matching entre 0 et 100 pour ces deux textes :\n\nCV : {cvText}\n\nJob Description : {jobDescription}\n\nRéponds uniquement par un nombre." } } }
                }
            };

            string jsonContent = JsonConvert.SerializeObject(requestBody);
            var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Adding API key to the request as a query parameter
            string requestUrl = $"{apiUrl}?key={apiKey}";

            HttpResponseMessage response = await client.PostAsync(requestUrl, httpContent);

            if (response.IsSuccessStatusCode)
            {
                string responseString = await response.Content.ReadAsStringAsync();
                dynamic result = JsonConvert.DeserializeObject(responseString);

                // Explicitly cast the content to a string if it's an object or JObject
                string content = result?.candidates?[0]?.content?.ToString() ?? "Erreur dans la réponse";
                return content;
            }
            else
            {
                return $"Erreur API : {response.StatusCode}";
            }
        }
    }
}
