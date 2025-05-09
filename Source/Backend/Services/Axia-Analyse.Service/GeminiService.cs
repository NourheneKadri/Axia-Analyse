using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class GeminiService
{
    private static readonly string apiKey = "AIzaSyDcmjJFXy1TH1iHu6A9UhjO-7ADWPmWLfM";  // Remplace avec ta clé API
    private static readonly string apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public async Task<string> GetMatchingScoreAsync(string cvText, string jobDescription, string skillsRequired, string Title, string Requirements)
    {
        using (HttpClient client = new HttpClient())
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = $"Comparez les compétences extraites du CV avec celles de l'offre d'emploi et donnez un pourcentage de correspondance entre 0 et 100. Ne répondez que par un chiffre.\n\nCV : {cvText}\n\nJob Description : {jobDescription}\n\nCompétences requises : {skillsRequired}\n\nTitre : {Title}" } } }
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
    public async Task<string> GetChatResponseAsync(List<(string role, string message)> history)
    {
        using (HttpClient client = new HttpClient())
        {
            var contents = history.Select(h => new
            {
                role = h.role, // "user" ou "model"
                parts = new[] { new { text = h.message } }
            });

            var requestBody = new { contents = contents };

            string jsonContent = JsonConvert.SerializeObject(requestBody);
            var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            string requestUrl = $"{apiUrl}?key={apiKey}";

            HttpResponseMessage response = await client.PostAsync(requestUrl, httpContent);

            if (response.IsSuccessStatusCode)
            {
                string responseString = await response.Content.ReadAsStringAsync();
                dynamic result = JsonConvert.DeserializeObject(responseString);

                string content = result?.candidates?[0]?.content?.parts?[0]?.text?.ToString();
                return content ?? "Réponse vide";
            }
            else
            {
                return $"Erreur API : {response.StatusCode}";
            }
        }
    }
    public async Task<string> ExtractDefectsWithImprovementAsync(string originalCvText)
    {
        try
        {
            using (HttpClient client = new HttpClient())
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                    new
                    {
                        parts = new[]
                        {
                            new { text = $"Voici un CV à analyser :\n\n{originalCvText}\n\nIdentifie les défauts de ce CV et donne des conseils d'amélioration précis pour chaque point. Réponds uniquement par une liste de défauts avec des suggestions d'amélioration. Ne répète pas le contenu du CV, seulement les points à améliorer et les conseils pour les corriger." }
                        }
                    }
                }
                };

                string jsonContent = JsonConvert.SerializeObject(requestBody);
                var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                string requestUrl = $"{apiUrl}?key={apiKey}";

                HttpResponseMessage response = await client.PostAsync(requestUrl, httpContent);

                if (response.IsSuccessStatusCode)
                {
                    string responseString = await response.Content.ReadAsStringAsync();
                    dynamic result = JsonConvert.DeserializeObject(responseString);

                    // Vérification si le résultat contient le texte amélioré
                    string improvedText = result?.candidates?[0]?.content?.parts?[0]?.text?.ToString();

                    if (string.IsNullOrEmpty(improvedText))
                    {
                        return "Aucune analyse des défauts n'a été retournée.";
                    }

                    return improvedText;
                }
                else
                {
                    return $"Erreur API : {response.StatusCode}. Détails : {await response.Content.ReadAsStringAsync()}";
                }
            }
        }
        catch (Exception ex)
        {
            return $"Erreur lors de l'appel API : {ex.Message}";
        }
    }



}
