using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface IJobOfferCandidancyRepository
    {

        Task<JobOfferCandidancy> GetByIdAsync(int id);
        Task<IEnumerable<JobOfferCandidancy>> GetAllAsync();
        Task AddAsync(JobOfferCandidancy entity);
        Task UpdateAsync(JobOfferCandidancy entity);
        Task DeleteAsync(int id);
        Task<JobOfferCandidancy> GetByCandidateAndJobOfferIdsAsync(int candidateProfileId, int jobOfferId);
        Task<List<UserAccount>> GetCandidateProfilesByJobOfferId(int jobOfferId);
        Task<List<JobOfferCandidancy>> GetSortedCandidaturesAsync(int jobOfferId, string sortBy);
    }
}
