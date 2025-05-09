using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        // Créer une nouvelle entreprise
        public async Task<Company> CreateCompanyAsync(CompanyDto companyDto)
        {
            bool exists = await _companyRepository.ExistsBySiretAsync(companyDto.SIRET);
            if (exists)
            {
                throw new Exception("Une entreprise avec ce SIRET existe déjà.");
            }

            var company = new Company
            {
                Name = companyDto.Name,
                SIRET = companyDto.SIRET,
                Phone = companyDto.Phone,
                Email = companyDto.Email,
                adress = companyDto.adress,

                LogoUrl = companyDto.LogoUrl
            };

            // Créer et retourner l'entreprise
            return await _companyRepository.CreateCompanyAsync(company);
        }


        // Récupérer une entreprise par son ID
        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            return await _companyRepository.GetCompanyByIdAsync(id);
        }

        // Récupérer toutes les entreprises
        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            return await _companyRepository.GetAllCompaniesAsync();
        }

        // Mettre à jour une entreprise existante
        public async Task<Company> UpdateCompanyAsync(Company company)
        {
            return await _companyRepository.UpdateCompanyAsync(company);
        }

        // Supprimer une entreprise par son ID
        public async Task<bool> DeleteCompanyAsync(int id)
        {
            return await _companyRepository.DeleteCompanyAsync(id);
        }
    }
}
