using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class MailNotificationService
    {
        private readonly IAuthentificationService _authentificationService;
        private readonly IJobOfferService _jobOfferService;

        private readonly EmailSender _emailSender;

        public MailNotificationService(IAuthentificationService authenticationService, EmailSender emailSender,IJobOfferService jobOfferService)
        {
            _authentificationService = authenticationService;
            _emailSender = emailSender;
            _jobOfferService = jobOfferService;
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

        public async Task SendEmailNotification(InterviewInvitationDto dto)
        {
            var candidate = await _authentificationService.GetUserAccountByIdAsync(dto.CandidateId);
            var job = _jobOfferService.GetById(dto.JobId);
            var company = await _authentificationService.GetCompanyByUserAccountIdAsync(job.UserAccountId);
            var link = $"http://localhost:3000/candidatesingle_v2?jobId={dto.JobId}&recruiterId={job.UserAccountId}&candidateId={dto.CandidateId}";

            var toEmail = candidate.Email;
            var subject = $"🎯 Invitation entretien {job.Title} - {company.Name}";

            string body = $@"
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Votre invitation chez {company.Name}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #1976d2, #2196f3);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }}
        .content {{
            padding: 30px;
        }}
        .job-card {{
            background: #f5f9ff;
            border-left: 4px solid #1976d2;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }}
        .cta-button {{
            display: inline-block;
            padding: 12px 30px;
            background: #1976d2;
            color: white !important;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            margin: 15px 0;
            text-align: center;
        }}
        .footer {{
            padding: 20px;
            text-align: center;
            background: #f5f5f5;
            font-size: 12px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='margin:0;font-weight:500;'>Invitation à l'entretien</h1>
            <p style='margin:8px 0 0;opacity:0.9;'>PROFEEL Recrutement</p>
        </div>

        <div class='content'>
            <p>Bonjour {candidate.FirstName},</p>
            
            <p>Nous sommes impressionnés par votre profil et souhaitons vous rencontrer pour le poste :</p>
            
            <div class='job-card'>
                <h3 style='margin-top:0;color:#1976d2;'>{job.Title}</h3>
                <p style='margin-bottom:0;'><strong>{company.Name}</strong></p>
            </div>

            <p style='text-align:center;'>
                <a href='{link}' class='cta-button'>📅 Choisir mon créneau</a>
            </p>

            <p>Ce lien est valable 7 jours. Pour toute question, répondez simplement à cet email.</p>
            
            <p>Bonne journée,</p>
            <p><strong>Sarah Dupont</strong><br>
            Chargée de Recrutement<br>
            PROFEEL Talent Solutions</p>
        </div>

        <div class='footer'>
            <p>© {DateTime.Now.Year} PROFEEL Talent Solutions. Tous droits réservés.</p>
            <p>
                <a href='https://profeel.com' style='color:#1976d2;text-decoration:none;'>Website</a> | 
                <a href='mailto:contact@profeel.com' style='color:#1976d2;text-decoration:none;'>Contact</a> | 
                <a href='https://profeel.com/confidentialite' style='color:#1976d2;text-decoration:none;'>Confidentialité</a>
            </p>
        </div>
    </div>
</body>
</html>";

            await _emailSender.SendAsync(toEmail, subject, body);
        }

        public async Task SendInterviewConfirmation(InterviewDto dto)
        {
            var candidate = await _authentificationService.GetUserAccountByIdAsync(dto.CandidateId);
            var job = _jobOfferService.GetById(dto.JobId);
            var company = await _authentificationService.GetCompanyByUserAccountIdAsync(job.UserAccountId);

            // Formatage de la date et heure
            var interviewDate = dto.InterviewDate.ToString("dddd dd MMMM yyyy", new CultureInfo("fr-FR"));
            var interviewTime = dto.InterviewTime;

            var toEmail = candidate.Email;
            var subject = $"✅ Confirmation entretien {job.Title} - {company.Name}";

            string body = $@"
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Confirmation d'entretien</title>
    <style>
        body {{
            font-family: 'Montserrat', 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }}
        .header h1 {{
            font-weight: 600;
            font-size: 24px;
            margin: 0;
        }}
        .content {{
            padding: 32px;
        }}
        .interview-card {{
            background: #f0f5ff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }}
        .interview-detail {{
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }}
        .icon {{
            margin-right: 12px;
            color: #4f46e5;
            font-size: 18px;
        }}
        .cta-button {{
            display: inline-block;
            padding: 14px 32px;
            background: #4f46e5;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
        }}
        .cta-button:hover {{
            background: #4338ca;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }}
        .footer {{
            padding: 24px;
            text-align: center;
            background: #f1f5f9;
            font-size: 13px;
            color: #64748b;
        }}
    </style>
    <link href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap' rel='stylesheet'>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Votre entretien est confirmé</h1>
        </div>

        <div class='content'>
            <p>Bonjour {candidate.FirstName},</p>
            
            <p>Votre entretien pour le poste <strong>{job.Title}</strong> a été programmé avec succès.</p>
            
            <div class='interview-card'>
                <div class='interview-detail'>
                    <span class='icon'>📅</span>
                    <div>
                        <strong>Date:</strong> {interviewDate}
                    </div>
                </div>
                <div class='interview-detail'>
                    <span class='icon'>🕒</span>
                    <div>
                        <strong>Heure:</strong> {interviewTime} 
                    </div>
                </div>
                <div class='interview-detail'>
                    <span class='icon'>🏢</span>
                    <div>
                        <strong>Entreprise:</strong> {company.Name}
                    </div>
                </div>
                <div class='interview-detail'>
                    <span class='icon'>📍</span>
                    <div>
                        <strong>Lieu:</strong> {dto.Location ?? "Entretien en visioconférence"}
                    </div>
                </div>
            </div>

            
           
            <p>En cas d'empêchement, merci de nous contacter au moins 48h à l'avance.</p>
            
            <p>Cordialement,</p>
            <p><strong>L'équipe Recrutement</strong><br>
            {company.Name}</p>
        </div>

        <div class='footer'>
            <p>© {DateTime.Now.Year} {company.Name}. Tous droits réservés.</p>
            <p>
                <a href='https://profeel.com' style='color:#4f46e5;text-decoration:none;'>Website</a> | 
                <a href='mailto:contact@profeel.com' style='color:#4f46e5;text-decoration:none;'>Contact</a>
            </p>
        </div>
    </div>
</body>
</html>";

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
