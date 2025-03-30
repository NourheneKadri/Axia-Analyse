using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface ICompanyService
    {
        Task<Company> CreateCompanyAsync(CompanyDto company);
        Task<Company> GetCompanyByIdAsync(int id);
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company> UpdateCompanyAsync(Company company);
        Task<bool> DeleteCompanyAsync(int id);
    }
}
