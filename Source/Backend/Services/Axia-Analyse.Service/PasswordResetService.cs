using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using System.Security.Cryptography;
using System.Text;
using Axia_Analyse.Service.Interfaces;
namespace Axia_Analyse.Service
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly IUserAccountRepository _userRepository;
        private readonly EmailSender _emailSender;
        private readonly BCryptPasswordHasher _bCryptPasswordHasher;


        public PasswordResetService(IUserAccountRepository userRepository, EmailSender emailSender, BCryptPasswordHasher bCryptPasswordHasher)
        {
            _userRepository = userRepository;
            _emailSender = emailSender;
            _bCryptPasswordHasher = bCryptPasswordHasher; // Ajout de l'initialisation
        }

        public async Task<Result> ResetPasswordAsync(string emailAddress)
        {
            UserAccount user = await _userRepository.GetUserAccountByEmailAsync(emailAddress);
            if (user == null)
                return Result.Failure("User not found");

            string newPassword = GenerateBase62(10);
            string loginLink = "http://localhost:3000/login";
            
            var pass = _bCryptPasswordHasher.HashPassword(newPassword);
            user.Password = pass;
            await _userRepository.UpdateUserAccountAsync(user);

            string subject = "Réinitialisation du mot de passe - Mawahub";
            var body = $@"
                <!DOCTYPE html>
                <html lang='fr'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Réinitialisation du mot de passe - Mawahub</title>
                    <style>
                        body {{
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }}
                        .header {{
                            background-color: #565656;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                        }}
                        .header h1 {{
                            font-size: 24px;
                            margin: 0;
                        }}
                        .content {{
                            padding: 30px;
                            color: #333333;
                        }}
                        .content p {{
                            margin-bottom: 20px;
                        }}
                        .footer {{
                            background-color: #f9f9f9;
                            color: #777777;
                            text-align: center;
                            padding: 15px;
                            font-size: 12px;
                            border-top: 1px solid #dddddd;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Réinitialisation de votre mot de passe</h1>
                        </div>
                        <div class='content'>
                            <p>Bonjour {user.FirstName},</p>
                            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Mawahub.</p>
                            <p>Votre nouveau mot de passe est : <strong>{newPassword}</strong></p>
                            <p>Pour des raisons de sécurité, nous vous conseillons de changer ce mot de passe dès votre première connexion.</p>
                            <a href='{loginLink}' style='display: inline-block; padding: 12px 20px; background-color: #565656; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; text-align: center;'>Se connecter</a>
                            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail ou contacter notre support.</p>
                            <p>Merci,<br>L'équipe Mawahub</p>
                        </div>
                        <div class='footer'>
                            <p>&copy; 2024 Mawahub. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await _emailSender.SendAsync(emailAddress, subject, body);

            return Result.Success();
        }

        private string GenerateBase62(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var stringBuilder = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                stringBuilder.Append(chars[random.Next(chars.Length)]);
            }
            return stringBuilder.ToString();
        }

        private string EncryptWithSha256(string input)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(input);
                var hashBytes = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
