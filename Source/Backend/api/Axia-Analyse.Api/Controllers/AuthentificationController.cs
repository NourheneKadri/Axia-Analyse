using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Axia_Analyse.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.AspNetCore.Authorization;
using Axia_Analyse.Data.Interface.Entites;

namespace Axia_Analyse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthentificationService _authenticationService;
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IPasswordResetService _passwordResetService;



        public AuthenticationController(IAuthentificationService authenticationService, IPasswordResetService passwordResetService)
        {
            _authenticationService = authenticationService;
            _passwordResetService = passwordResetService ?? throw new ArgumentNullException(nameof(passwordResetService));
        }

        [HttpPost("login")]
        [AllowAnonymous]

        public async Task<IActionResult> Login([FromBody] UserAccountLoginDto loginDto)
        {
            if (loginDto == null)
            {
                return BadRequest("Invalid login data.");
            }

            var loginResponse = await _authenticationService.LoginAsync(loginDto);

            if (loginResponse == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(loginResponse);
        }

        // POST: api/authentication/register
        [HttpPost("register")]
        [AllowAnonymous] 
        public async Task<IActionResult> RegisterAsync([FromBody] UserAccountRegisterDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("Invalid registration data");
            }


            var success = await _authenticationService.RegisterAsync(userDto);

            if (!success)
            {
                return Conflict("User already exists");
            }

            return Ok("Registration successful");
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Échec de l'authentification Google.");

            var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            //var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
                return BadRequest("Impossible de récupérer l'email Google.");

            // 📌 Vérifier si l'utilisateur existe dans la base de données
            var user = await _userAccountRepository.GetUserAccountByEmailAsync(email);

            if (user == null)
            {
               return NotFound();
            }

            // 📌 Générer un token JWT pour la session de l'utilisateur

            return Ok(new
            {
                Message = "Authentification réussie !",
                Email = user.Email,
            });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email address is required.");
            }

            var result = await _passwordResetService.ResetPasswordAsync(request.Email);
            return result.IsFailure
                ? BadRequest(result.Error)
                : Ok("Password reset successfully. Please check your email.");
        }

        [HttpGet("company/{userAccountId}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetCompanyByUserAccount(int userAccountId)
        {
            var company = await _authenticationService.GetCompanyByUserAccountIdAsync(userAccountId);

            if (company == null)
            {
                return NotFound("Company not found for the given user account.");
            }

            return Ok(company);
        }
        [HttpPost("create")]
        [AllowAnonymous]

        public async Task<IActionResult> CreateUserAccount([FromBody] UserAccount userAccount)
        {
            if (userAccount == null) return BadRequest("Les données de l'utilisateur sont invalides.");

            bool created = await _authenticationService.CreateUserAccountAsync(userAccount);
            if (!created) return StatusCode(500, "Erreur lors de la création de l'utilisateur.");

            return Ok(new { message = "Utilisateur créé avec succès !" });
        }

        // ✅ 2. Mettre à jour un utilisateur
        [HttpPut("update/{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> UpdateUserAccount(int id, [FromBody] UserAccount user)
        {
            if (user == null || id != user.Id) return BadRequest("Mauvaise requête.");

            await _authenticationService.UpdateUserAccountAsync(user);
            return Ok(new { message = "Utilisateur mis à jour avec succès !" });
        }

        // ✅ 3. Supprimer un utilisateur
        [HttpDelete("delete/{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> DeleteUserAccount(int id)
        {
            bool deleted = await _authenticationService.DeleteUserAccountAsync(id);
            if (!deleted) return NotFound("Utilisateur non trouvé.");

            return Ok(new { message = "Utilisateur supprimé avec succès !" });
        }

        // ✅ 4. Récupérer tous les utilisateurs
        [HttpGet("all")]
        [AllowAnonymous]

        public async Task<ActionResult<IEnumerable<UserAccount>>> GetAllUsers()
        {
            var users = await _authenticationService.GetAllUsersAsync();
            return Ok(users);
        }

    }


}

