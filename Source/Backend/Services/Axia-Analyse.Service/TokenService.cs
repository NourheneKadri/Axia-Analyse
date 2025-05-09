using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using CryptoHelper;
using Microsoft.Extensions.Configuration;

namespace Axia_Analyse.Service
{
    public static class TokenService
    {
       
        private static string jwtSecret = "bRhYJRlZvBj2vW4MrV5HVdPgIE6VMtCFB0kTtJ1m";
        private static int jwtLifespan = 2592000;

        public static string GetAuthData(string id)
        {
            var expirationTime = DateTime.UtcNow.AddSeconds(jwtLifespan);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, id)
                }),
                Expires = expirationTime,
                
                // new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature)
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

            return token;
        }

        public static string HashPassword(string password)
        {
            return Crypto.HashPassword(password);
        }

        public static bool VerifyPassword(string actualPassword, string hashedPassword)
        {
            return Crypto.VerifyHashedPassword(hashedPassword, actualPassword);
        }
    }
}
