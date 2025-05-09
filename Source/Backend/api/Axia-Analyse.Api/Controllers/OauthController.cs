using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Axia_Analyse.Controllers
{
    public class OauthController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly ItokenService tokenService;

        // Injection de la configuration via le constructeur
        public OauthController(IConfiguration configuration,ItokenService tokenService)
        {
            this.configuration = configuration;
            this.tokenService = tokenService;
        }

        // Redirige l'utilisateur vers Google OAuth
        [AllowAnonymous]

        public IActionResult Authorize()
        {
            var url = "https://accounts.google.com/o/oauth2/v2/auth?" +
                $"scope={this.configuration.GetValue<string>("scope")}" +
                $"&access_type=offline" +
                $"&response_type=code" +
                $"&state=kadriNourhene" +
                $"&redirect_uri={this.configuration.GetValue<string>("RedirectionUrl")}" +
                $"&client_id={this.configuration.GetValue<string>("clientId")}" +
                $"&prompt=consent";  // 🔥 Ajout essentiel

            return Redirect(url);
        }


        // Point de retour après authentification
        [AllowAnonymous]

        public async Task Callback(string code, string state)
        {


           await this.tokenService.GetTokenAsync(code);

        }
    }
}
