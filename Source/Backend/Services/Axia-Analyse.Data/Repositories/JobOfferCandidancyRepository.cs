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
    public class JobOfferCandidancyRepository : IJobOfferCandidancyRepository
    {
        private readonly AxiaDbContext _dbContext;

        public JobOfferCandidancyRepository(AxiaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<JobOfferCandidancy> GetByIdAsync(int id)
        {
            return await _dbContext.JobOfferCandidancy.FindAsync(id);
        }

        public async Task<IEnumerable<JobOfferCandidancy>> GetAllAsync()
        {
            return await _dbContext.JobOfferCandidancy
                .Include(c => c.JobOffer) // Charger JobOffer
                .ThenInclude(j => j.UserAccount) // Charger UserAccount de JobOffer
                .ThenInclude(u => u.Company) // Charger Company de UserAccount
                .Where(c => c.JobOffer != null && c.JobOffer.UserAccount != null && c.JobOffer.UserAccount.Company != null) // Vérifier si Company existe
                .ToListAsync();
        }




        public async Task AddAsync(JobOfferCandidancy entity)
        {
            await _dbContext.JobOfferCandidancy.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(JobOfferCandidancy entity)
        {
            _dbContext.JobOfferCandidancy.Update(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbContext.JobOfferCandidancy.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<UserAccount>> GetCandidateProfilesByJobOfferId(int jobOfferId)
        {
            return await _dbContext.UserAccount
                .Where(candidate => _dbContext.JobOfferCandidancy
                    .Where(c => c.JobOfferId == jobOfferId)
                    .Select(c => c.CandidateProfileId)
                    .Contains(candidate.Id))
                .ToListAsync();
        }

        public async Task<JobOfferCandidancy> GetByCandidateAndJobOfferIdsAsync(int candidateProfileId, int jobOfferId)
        {
            return await _dbContext.JobOfferCandidancy
                .FirstOrDefaultAsync(c => c.CandidateProfileId == candidateProfileId && c.JobOfferId == jobOfferId);
        }



        public async Task<List<JobOfferCandidancy>> GetSortedCandidaturesAsync(int jobOfferId, string sortBy)
        {
            IQueryable<JobOfferCandidancy> query = _dbContext.JobOfferCandidancy
                .Where(c => c.JobOfferId == jobOfferId)
                .Include(c => c.CandidateProfileId);

            query = sortBy switch
            {
                "submissionDate" => query.OrderBy(c => c.SubmissionDate),
                "updatedAt" => query.OrderBy(c => c.UpdatedAt),
                "statusId" => query.OrderBy(c => c.StatusId),
                _ => query.OrderBy(c => c.SubmissionDate),
            };

            return await query.ToListAsync();
        }

        public async Task<List<JobOfferCandidancy>> GetCandidaciesByUserAccountIdAsync(int userAccountId)
        {
            // Récupérer toutes les offres d'emploi publiées par l'utilisateur
            var jobOffers = await _dbContext.JobOffer
                .Where(jo => jo.UserAccountId == userAccountId)  // Filtrer par UserAccountId
                .Select(jo => jo.Id)  // Sélectionner l'ID des JobOffers
                .ToListAsync();

            // Récupérer les candidatures correspondantes aux JobOffers de cet utilisateur
            var candidacies = await _dbContext.JobOfferCandidancy
                .Where(c => jobOffers.Contains(c.JobOfferId))  // Filtrer par les JobOfferIds
                .ToListAsync();

            return candidacies;
        }
    }
}
