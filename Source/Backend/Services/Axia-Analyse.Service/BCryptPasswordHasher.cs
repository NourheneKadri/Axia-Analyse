using CryptoHelper;
using BCrypt.Net;

namespace Axia_Analyse.Service
{
    public class BCryptPasswordHasher
    {
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password); 
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword); 
        }
    }
}
