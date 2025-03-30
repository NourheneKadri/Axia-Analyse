using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface ICompanyRepository
    {
        Task<Company> CreateCompanyAsync(Company company);
        Task<Company> GetCompanyByIdAsync(int id);
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company> UpdateCompanyAsync(Company company);
        Task<bool> DeleteCompanyAsync(int id);
        Task<bool> ExistsBySiretAsync(string siret);


    }
}

