using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IJobOfferService
    {
        JobOffer GetById(int id);
        IEnumerable<JobOffer> GetAll();
        bool Add(JobOfferDto jobOfferDto);
        bool Update(JobOffer jobOffer);
        bool Remove(int jobOfferId);
        Task<IEnumerable<JobOffer>> SearchJobOffersAsync(string? title, string? address, int? categoryId); 
         Task<IEnumerable<JobOfferCategories>> GetAllCategoriesAsync();
        Task<IEnumerable<dynamic>> GetJobOffersCountByCategoryAsync();
        Task<IEnumerable<JobOffer>> GetRecentJobsAsyn();
        Task<IEnumerable<JobOffer>> GetJobOffersByTypeIdAsync(int jobTypeId);
        Task<IEnumerable<JobOffer>> GetJobOffersByCategoryIdAsync(int categoryId);
        Task<IEnumerable<dynamic>> GetJobOfferCountByCompanyAsync();



    }
}
