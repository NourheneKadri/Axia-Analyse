using Axia_Analyse.Data.Interface.Entites;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface IJobOfferRepository
    {
        JobOffer GetById(int id);
        IEnumerable<JobOffer> GetAll();
        bool Add(JobOffer jobOffer);
        bool Update(JobOffer jobOffer);
        bool Delete(int id);
        Task<IEnumerable<JobOffer>> SearchJobOffersAsync(string? title, string? address, int? categoryId);      
        Task<IEnumerable<JobOffer>> GetJobOffersByCategoryIdAsync(int categoryId);
        Task<IEnumerable<JobOffer>> GetJobOffersByTypeIdAsync(int jobTypeId);

        Task<IEnumerable<JobOfferCategories>> GetAllCategoriesAsync();

        Task<IEnumerable<dynamic>> GetJobOffersCountByCategoryAsync();

        Task<List<JobOffer>> GetRecentJobsAsync();
        Task<IEnumerable<dynamic>> GetJobOfferCountByCompanyAsync();



    }
}
