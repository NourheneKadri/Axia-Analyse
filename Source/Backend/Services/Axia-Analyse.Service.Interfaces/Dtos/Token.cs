using System;
using System.Text.Json.Serialization;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class Token
    {
        public Token()
        {
            this.GeneratedOn = DateTime.UtcNow;
        }

        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; }

        [JsonPropertyName("refresh_token_expires_in")]
        public int? RefreshTokenExpiresIn { get; set; }

        [JsonPropertyName("scope")]
        public string Scope { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }

        [JsonIgnore]
        public DateTime GeneratedOn { get; set; }

        [JsonIgnore]
        public bool IsTokenExpired
        {
            get
            {
                // Utiliser UTC maintenant pour une comparaison plus fiable
                return this.GeneratedOn.AddSeconds(this.ExpiresIn) <= DateTime.UtcNow;
            }
        }

    }
}
