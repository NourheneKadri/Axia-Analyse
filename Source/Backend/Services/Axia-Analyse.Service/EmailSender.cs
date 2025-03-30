using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace Axia_Analyse.Service
{
    public class EmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            string smtpServer = smtpSettings["Server"];
            int smtpPort = int.Parse(smtpSettings["Port"]);
            string smtpUsername = smtpSettings["Username"];
            string smtpPassword = smtpSettings["Password"];
            bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]);

            using (var smtpClient = new SmtpClient(smtpServer, smtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.EnableSsl = enableSsl;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpUsername),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(to);

                await smtpClient.SendMailAsync(mailMessage);
            }
        }
    }
}
