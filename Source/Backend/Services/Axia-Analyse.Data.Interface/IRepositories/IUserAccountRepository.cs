using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface IUserAccountRepository
    {



        Task<bool> CreateUserAccountAsync(UserAccount userAccount);


        Task UpdateUserAccountAsync(UserAccount user);


        Task<bool> DeleteUserAccountAsync(int userId);


        Task<IEnumerable<UserAccount>> GetAllUsersAsync();


        Task<UserAccount> GetUserAccountByIdAsync(int userId);

        Task<UserAccount> GetUserAccountByEmailAsync(string email);
        Task<Company?> GetCompanyByUserAccountIdAsync(int userAccountId);



    }
}
