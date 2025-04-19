using Axia_Analyse.Data.Interface.Constantes;
using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CloudinaryDotNet;
using System.Reflection.Metadata.Ecma335;

namespace Axia_Analyse.Service
{
    public class JobOfferCandidancyService : IJobOfferCandidancyService
    {
        private readonly IJobOfferCandidancyRepository _repository;
        private readonly IUserAccountRepository _userAccountRepository;

        public JobOfferCandidancyService(IJobOfferCandidancyRepository repository, IUserAccountRepository userRepository)
        {
            _repository = repository;
            _userAccountRepository = userRepository;
        }

        public async Task<JobOfferCandidancyDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return new JobOfferCandidancyDto
            {
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                CVurl = entity.CVurl
            };
        }

        public async Task<IEnumerable<JobOfferCandidancy>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(e => new JobOfferCandidancy
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                CandidateProfileId = e.CandidateProfileId,
                JobOfferId = e.JobOfferId,
                SubmissionDate = e.SubmissionDate,
                UpdatedAt = e.UpdatedAt,
                StatusId = e.StatusId,
                CVurl = e.CVurl,
                score = e.score,
            });
        }

        public async Task AddAsync(JobOfferCandidancyDto dto)
        {
            var user = await _userAccountRepository.GetUserAccountByIdAsync(dto.CandidateProfileId);

            if (user == null || user.AppRoleId != 3)
            {
                throw new InvalidOperationException("Seuls les candidats peuvent postuler.");
            }

            var existingCandidacy = await _repository.GetByCandidateAndJobOfferIdsAsync(dto.CandidateProfileId, dto.JobOfferId);

            if (existingCandidacy != null)
            {
                throw new InvalidOperationException("Le candidat a déjà postulé à cette offre.");
            }

            var entity = new JobOfferCandidancy
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                CandidateProfileId = dto.CandidateProfileId,
                JobOfferId = dto.JobOfferId,
                SubmissionDate = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                StatusId = JobOfferCandidancyStatus.PENDING,
                CVurl= dto.CVurl,
                score = dto.score,
            };

            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(JobOfferCandidancy dto)
        {
            var existingEntity = await _repository.GetByIdAsync(dto.Id);
            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Entity not found.");
            }

            existingEntity.CandidateProfileId = dto.CandidateProfileId;
            existingEntity.JobOfferId = dto.JobOfferId;
            existingEntity.SubmissionDate = dto.SubmissionDate;
            existingEntity.UpdatedAt = DateTime.UtcNow;
            existingEntity.StatusId = dto.StatusId;

            await _repository.UpdateAsync(existingEntity);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<List<UserAccount>> GetCandidateProfilesByJobOfferId(int jobOfferId)
        {
            return await _repository.GetCandidateProfilesByJobOfferId(jobOfferId);
        }

       

        public async Task<IEnumerable<JobOfferCandidancy>> GetSortedCandidaturesAsync(string sortBy)
        {
            var candidatures = await _repository.GetAllAsync();
            if (candidatures == null || !candidatures.Any())
            {
                return Enumerable.Empty<JobOfferCandidancy>();
            }

            return SortCandidatures(candidatures, sortBy);
        }

        private IEnumerable<JobOfferCandidancy> SortCandidatures(IEnumerable<JobOfferCandidancy> candidatures, string sortBy)
        {
            switch (sortBy.ToLower())
            {
                case "submissiondate":
                    return candidatures.OrderByDescending(c => c.SubmissionDate);
                case "status":
                    return candidatures.OrderBy(c => c.StatusId);
                default:
                    return candidatures;
            }
        }
        public async Task<List<JobOfferCandidancy>> GetCandidaciesByUserAccountIdAsync(int userAccountId) => await _repository.GetCandidaciesByUserAccountIdAsync(userAccountId);
        public async Task<bool> UpdateCandidacyStatusAsync(int candidateId, int jobOfferId, int statusId)
        {
            try
            {
                var candidacy = await _repository.GetByCandidateAndJobOfferIdsAsync(candidateId, jobOfferId);

                if (candidacy == null)
                {
                    return false;
                }

                candidacy.StatusId = statusId;

                await _repository.UpdateAsync(candidacy);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

       


    }
    
}
