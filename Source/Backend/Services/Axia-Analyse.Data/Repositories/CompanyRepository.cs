using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {

        private readonly AxiaDbContext _dbContext;

        public CompanyRepository(AxiaDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        // Créer une nouvelle entreprise
        public async Task<Company> CreateCompanyAsync(Company company)
        {
            _dbContext.company.Add(company);
            await _dbContext.SaveChangesAsync();
            return company;
        }

        // Récupérer une entreprise par son ID
        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            return await _dbContext.company.FindAsync(id);
        }

        // Récupérer toutes les entreprises
        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            return await _dbContext.company.ToListAsync();
        }

        // Mettre à jour une entreprise existante
        public async Task<Company> UpdateCompanyAsync(Company company)
        {
            _dbContext.company.Update(company);
            await _dbContext.SaveChangesAsync();
            return company;
        }

        public async Task<bool> DeleteCompanyAsync(int id)
        {
            // Démarrer une transaction
            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                // 1. Vérifier l'existence de l'entreprise
                var company = await _dbContext.company.FindAsync(id);
                if (company == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                // 2. Get all user IDs for the company first
                var userIds = await _dbContext.UserAccount
                    .Where(u => u.CompanyId == id)
                    .Select(u => u.Id)
                    .ToListAsync();

                // 3. Get all job offer IDs for these users
                var jobOfferIds = await _dbContext.JobOffer
                    .Where(j => userIds.Contains(j.UserAccountId))
                    .Select(j => j.Id)
                    .ToListAsync();

                // 4. Suppression en cascade optimisée
                // a. Supprimer les candidatures liées aux offres
                await _dbContext.JobOfferCandidancy
                    .Where(a => jobOfferIds.Contains(a.JobOfferId))
                    .ExecuteDeleteAsync();

                // b. Supprimer les offres d'emploi
                await _dbContext.JobOffer
                    .Where(j => userIds.Contains(j.UserAccountId))
                    .ExecuteDeleteAsync();

                // c. Supprimer les utilisateurs de l'entreprise
                await _dbContext.UserAccount
                    .Where(u => u.CompanyId == id)
                    .ExecuteDeleteAsync();

                // 5. Supprimer l'entreprise
                _dbContext.company.Remove(company);
                await _dbContext.SaveChangesAsync();

                // 6. Valider la transaction
                await transaction.CommitAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                await transaction.RollbackAsync();
                // Log : $"Concurrency conflict deleting company {id}: {ex.Message}"
                return false;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Log : $"Error deleting company {id}: {ex.Message}"
                return false;
            }
        }



        public async Task<bool> ExistsBySiretAsync(string siret)
        {
            return await _dbContext.company.AnyAsync(c => c.SIRET == siret);
        }
      

    }
}
