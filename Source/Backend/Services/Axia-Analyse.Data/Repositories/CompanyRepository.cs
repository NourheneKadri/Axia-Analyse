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
            // Récupérer l'entreprise à supprimer
            var company = await _dbContext.company
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
                return false;

            // Récupérer tous les utilisateurs associés à l'entreprise
            var users = await _dbContext.UserAccount.Where(u => u.CompanyId == company.Id).ToListAsync();

            // Mettre la colonne CompanyId à NULL pour dissocier les utilisateurs de l'entreprise
            foreach (var user in users)
            {
                user.CompanyId = null;
            }

            // Sauvegarder les changements
            await _dbContext.SaveChangesAsync();

            // Supprimer l'entreprise
            _dbContext.company.Remove(company);

            // Sauvegarder les changements pour supprimer l'entreprise
            await _dbContext.SaveChangesAsync();

            return true;
        }




        public async Task<bool> ExistsBySiretAsync(string siret)
        {
            return await _dbContext.company.AnyAsync(c => c.SIRET == siret);
        }
      

    }
}
