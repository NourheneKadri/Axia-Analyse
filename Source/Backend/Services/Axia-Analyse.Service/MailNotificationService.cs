using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class MailNotificationService
    {
        private readonly IAuthentificationService _authentificationService;
        private readonly EmailSender _emailSender;

        public MailNotificationService(IAuthentificationService authenticationService, EmailSender emailSender)
        {
            _authentificationService = authenticationService;
            _emailSender = emailSender;
        }

        public async Task NotifyCandidateAsync(int candidateId, bool isAccepted)
        {

            var candidate = await _authentificationService.GetUserAccountByIdAsync(candidateId);

            if (candidate == null)
            {
                throw new Exception("Candidate not found");
            }

            string subject = isAccepted ? "Félicitations! Votre candidature a été acceptée" : "Désolé, votre candidature a été refusée";
            string body = isAccepted ? GenerateAcceptanceEmailBody(candidate.FirstName) : GenerateRefusalEmailBody(candidate.FirstName);

            await _emailSender.SendAsync(candidate.Email, subject, body);
        }

        private string GenerateAcceptanceEmailBody(string firstName)
        {
            return $@"
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Félicitations! Votre candidature a été acceptée</title>
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
                background-color: #4CAF50;
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
                <h1>Félicitations!</h1>
            </div>
            <div class='content'>
                <p>Bonjour {firstName},</p>
                <p>Nous sommes ravis de vous annoncer que votre candidature a été acceptée.</p>
                <p>Nous vous contacterons bientôt pour les prochaines étapes du processus.</p>
                <p>Merci,<br>L'équipe de recrutement</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Votre Entreprise. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>";
        }

        private string GenerateRefusalEmailBody(string firstName)
        {
            return $@"
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Désolé, votre candidature a été refusée</title>
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
                background-color: #545454;
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
        <img src=""https://res.cloudinary.com/dbd15wovr/image/upload/v1724856152/mawaheb-removebg-preview_1_rcmnuk.png"" alt=""Logo"" style=""max-width: 100px; height: 100;"">
            </div>
            <div class='content'>
                <p>Bonjour {firstName},</p>
                <p>Nous regrettons de vous informer que votre candidature n'a pas été retenue.</p>
                <p>Nous vous remercions pour votre intérêt et vous souhaitons bonne chance dans vos recherches futures.</p>
                <p>Merci,<br>L'équipe de recrutement</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Votre Entreprise. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>";
        }


        public async Task SendEmailNotification(Interview dto, string action)
        {
            // Récupérer les informations du candidat
            var candidate = await _authentificationService.GetUserAccountByIdAsync(dto.CandidateId);
            var toEmail = candidate.Email;

            string imageUrl = "https://res.cloudinary.com/dbd15wovr/image/upload/v1724856152/mawaheb-removebg-preview_1_rcmnuk.png";
            string base64Logo = await ConvertImageToBase64StringAsync(imageUrl);
            string base64LogoDataUri = $"data:image/png;base64,{base64Logo}";

            // Préparer les informations de l'entretien
            var interviewDate = dto.InterviewDate;
            // Assurez-vous que `dto.Date` est la date de l'entretien
            var formattedDate = interviewDate.ToString("dd MMMM yyyy");

            var newLocation = dto.Status; // Assurez-vous que `dto.Location` contient le lieu de l'entretien

            // Sujet et corps de l'e-mail
            var subject = $"Interview {action}";
            string body = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Email Notification</title>
</head>
<body style='margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif;'>
<div style='background-color: #545454; padding: 20px 0; text-align: center; z-index: 1; position: relative; width: 600px; margin: 0 auto;'>
<img src=""https://res.cloudinary.com/dbd15wovr/image/upload/v1724856152/mawaheb-removebg-preview_1_rcmnuk.png"" alt=""Logo"" style=""max-width: 150px; height: 100;"">
    </div>
<div style=""max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); box-sizing: border-box; position: absolute; top: 0px; left: 0; right: 0; z-index: 10; margin-top :0px "" >
        <div style='color: #333333;'>
            <p>Bonjour {candidate.FirstName},</p>
            <p>Nous vous informons que votre entretien prévu pour le <strong> {formattedDate} </strong>  à  <strong>  {dto.InterviewDate} </strong> a été    <strong> {action} </strong>.</p>
          
            <p>Merci pour votre compréhension.</p>
            <p>Cordialement,</p>
            <p>L'équipe de PROFEEL Taalent Soultion </p>
        </div>
        <div style='background-color: #f1f1f1; padding: 10px 20px; text-align: center; border-radius: 0 0 8px 8px;'>
            <p style='margin: 0; color: #555555;'>&copy; 2024  PROFEEL Talent Solutions. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>";

            // Envoyer l'e-mail
            await _emailSender.SendAsync(toEmail, subject, body);
        }

        private async Task<string> ConvertImageToBase64StringAsync(string imageUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                // Télécharger l'image depuis l'URL
                byte[] imageBytes = await client.GetByteArrayAsync(imageUrl);

                // Convertir l'image en Base64
                return Convert.ToBase64String(imageBytes);
            }
        }
    }
}
