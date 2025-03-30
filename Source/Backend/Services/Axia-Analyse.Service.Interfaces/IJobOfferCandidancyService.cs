using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IJobOfferCandidancyService
    {
        Task<JobOfferCandidancyDto> GetByIdAsync(int id);
        Task<IEnumerable<JobOfferCandidancy>> GetAllAsync();
        Task AddAsync(JobOfferCandidancyDto dto);
        Task UpdateAsync(JobOfferCandidancy dto);
        Task DeleteAsync(int id);
        Task<List<UserAccount>> GetCandidateProfilesByJobOfferId(int jobOfferId);
        Task<IEnumerable<JobOfferCandidancy>> GetSortedCandidaturesAsync(string sortBy);
        Task<bool> UpdateCandidacyStatusAsync(int candidateId, int jobOfferId, int statusId);
    }
}
