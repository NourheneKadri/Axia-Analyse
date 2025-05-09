
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Util.Store;

namespace Axia_Analyse.Service
{
    public class GoogleAuthService
    {
        private static readonly string[] Scopes = { CalendarService.Scope.Calendar };
        private const string ApplicationName = "Google Calender Event Api";

        // Google client secrets (can be downloaded from Google Developer Console)
        private static readonly string ClientSecretsFile = @"C:\Users\Nourhene Kadri\Downloads\client_secret_644906509095-5tnrs8hhh77rrok0pqikn0a86mqboama.apps.googleusercontent.com.json";

        public async Task<string> GetAccessTokenAsync()
        {
            UserCredential credential;

            // Load the credentials from the client secrets file
            using (var stream = new FileStream(ClientSecretsFile, FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore("TokenStore"));
            }

            // Return the access token
            return credential.Token.AccessToken;
        }
    }
}
