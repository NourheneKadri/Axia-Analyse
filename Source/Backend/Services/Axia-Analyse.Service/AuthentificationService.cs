using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Data.Interface.Entites;
using System.ComponentModel.Design;
using Microsoft.EntityFrameworkCore;


namespace Axia_Analyse.Service
{
    public class AuthenticationService : IAuthentificationService
    {
        private readonly IUserAccountRepository _userRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly BCryptPasswordHasher _passwordHasher;
        public AuthenticationService(IUserAccountRepository userRepository)
        {
            _userRepository = userRepository;
            _passwordHasher = new BCryptPasswordHasher();
        }

        public async Task<LoginResponseDto> LoginAsync(UserAccountLoginDto loginDto)
        {
            var userAccount = await _userRepository.GetUserAccountByEmailAsync(loginDto.Email);

            if (userAccount == null)
            {
                return null;
            }
            var passwordHasher = new BCryptPasswordHasher();

            // Verify the password using BCrypt password hasher
            if (!passwordHasher.VerifyPassword(loginDto.Password, userAccount.Password))
            {
                return null; // Return null if password verification fails
            }

            var token = TokenService.GetAuthData(userAccount.Email);
            return new LoginResponseDto
            {
                Email = userAccount.Email,
                Token = token,
                AppRoleId = userAccount.AppRoleId,
                UserAccountId = userAccount.Id
            };
        }
        public async Task<bool> RegisterAsync(UserAccountRegisterDto userDto)
        {
            // Vérifier si l'utilisateur existe déjà
            var existingUser = await _userRepository.GetUserAccountByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                return false; // L'utilisateur existe déjà
            }


            // Hacher le mot de passe de l'utilisateur
            var hashedPassword = _passwordHasher.HashPassword(userDto.Password);

            // Créer un nouvel utilisateur avec les informations
            var newUser = new UserAccount
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = hashedPassword,
                Email = userDto.Email,
                AppRoleId = userDto.AppRoleId,
                CompanyId = userDto.companyId.HasValue ? userDto.companyId : null
            };

            // Créer l'utilisateur dans la base de données
            await _userRepository.CreateUserAccountAsync(newUser);

            return true; // Retourner true pour indiquer que l'enregistrement a réussi
        }

        public async Task<Company> GetCompanyByUserAccountIdAsync(int userAccountId)
        {
            // Récupérer l'utilisateur avec la société associée
            return await _userRepository.GetCompanyByUserAccountIdAsync(userAccountId);
            // Retourner la société associée
            
        }
        public async Task<bool> CreateUserAccountAsync(UserAccount userAccount)
        {
            if (userAccount == null) return false;
            return await _userRepository.CreateUserAccountAsync(userAccount);
        }

        public async Task UpdateUserAccountAsync(UserAccount user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            await _userRepository.UpdateUserAccountAsync(user);
        }

        public async Task<bool> DeleteUserAccountAsync(int userId)
        {
            return await _userRepository.DeleteUserAccountAsync(userId);
        }

        public async Task<IEnumerable<UserAccount>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }


    }
}
