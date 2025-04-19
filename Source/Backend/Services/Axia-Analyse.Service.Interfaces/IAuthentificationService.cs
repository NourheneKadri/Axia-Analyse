using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IAuthentificationService
    {
        Task<bool> RegisterAsync(UserAccountRegisterDto userDto);
        Task<UserAccount> GetUserAccountByIdAsync(int userId);
        Task<LoginResponseDto> LoginAsync(UserAccountLoginDto loginDto);
        Task<Company> GetCompanyByUserAccountIdAsync(int userAccountId);
        Task<bool> CreateUserAccountAsync(UserAccount userAccount);
        Task UpdateUserAccountAsync(UserAccount user);
        Task<bool> DeleteUserAccountAsync(int userId);
        Task<IEnumerable<UserAccount>> GetAllUsersAsync();
    }
}
