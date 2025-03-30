using Microsoft.EntityFrameworkCore;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Data.Interface.Entites;

namespace Axia_Analyse.Data.Repositories
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly AxiaDbContext _dbContext;
        public UserAccountRepository(AxiaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> CreateUserAccountAsync(UserAccount userAccount)
        {
            if (userAccount == null)
                return false;

            try
            {
                _dbContext.UserAccount.Add(userAccount);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public async Task<bool> DeleteUserAccountAsync(int userId)
        {
            if (userId <= 0)
                return false;

            try
            {
                var user = await _dbContext.UserAccount.FindAsync(userId);
                if (user == null)
                    return false;

                _dbContext.UserAccount.Remove(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task UpdateUserAccountAsync(UserAccount user)
        {

            var existingUser = await _dbContext.UserAccount
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (existingUser == null)
            {
                throw new InvalidOperationException("User not found");
            }


            existingUser.Email = user.Email;
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;




            _dbContext.UserAccount.Update(existingUser);
            await _dbContext.SaveChangesAsync();
        }


        public async Task<IEnumerable<UserAccount>> GetAllUsersAsync()
        {
            return await _dbContext.UserAccount.ToListAsync();
        }



        public async Task<UserAccount> GetUserAccountByIdAsync(int userId)
        {
            return await _dbContext.UserAccount.FindAsync(userId);
        }
        public async Task<UserAccount> GetUserAccountByEmailAsync(string email)
        {
            return await _dbContext.UserAccount.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Company> GetCompanyByUserAccountIdAsync(int userAccountId)
        {
            // Récupérer l'utilisateur avec la société associée
            var userAccount = await _dbContext.UserAccount
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Id == userAccountId);

            // Retourner la société associée
            return userAccount?.Company;
        }



    }
}
