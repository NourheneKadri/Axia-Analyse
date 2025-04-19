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

            var token = TokenService.GetAuthData(userAccount.Id.ToString(),userAccount.Email);
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
            var existingUser = await _userRepository.GetUserAccountByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                return false; 
            }


           
            var hashedPassword = _passwordHasher.HashPassword(userDto.Password);

            var newUser = new UserAccount
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Password = hashedPassword,
                Email = userDto.Email,
                AppRoleId = userDto.AppRoleId,
                CompanyId = userDto.companyId.HasValue ? userDto.companyId : null,
                Timestamp = DateTime.UtcNow 

            };

            await _userRepository.CreateUserAccountAsync(newUser);

            return true; 
        }

        public async Task<Company> GetCompanyByUserAccountIdAsync(int userAccountId)
        {
           
            return await _userRepository.GetCompanyByUserAccountIdAsync(userAccountId);
         
            
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

        public async Task<UserAccount> GetUserAccountByIdAsync(int userId)

        {
            return await _userRepository.GetUserAccountByIdAsync(userId);
        }
    }
}
