using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces.DtoConversion;



namespace Axia_Analyse.Service
{
    public class JobOfferServices : IJobOfferService
    {
        private readonly IJobOfferRepository _jobOfferRepository;

        public JobOfferServices(IJobOfferRepository JobOfferRepository)
        {
            _jobOfferRepository = JobOfferRepository;
        }

        // Get a JobOffer by Id
        public JobOffer GetById(int id)
        {
            return _jobOfferRepository.GetById(id);
        }

        // Get all JobOffers
        public IEnumerable<JobOffer> GetAll()
        {
            return _jobOfferRepository.GetAll();
        }

        // Add a new JobOffer
        public bool Add(JobOfferDto jobOfferDto)
        {
            var jobOffer = JobOfferDtoConversion.ToEntity(jobOfferDto, DateTime.Now);
            return _jobOfferRepository.Add(jobOffer);
        }

        // Update an existing JobOffer
        public bool Update(JobOffer jobOffer)
        {
            return _jobOfferRepository.Update(jobOffer);
        }

        // Remove a JobOffer (mark as deleted)
        public bool Remove(int jobOfferId)
        {
            var jobOffer = _jobOfferRepository.GetById(jobOfferId);
            if (jobOffer == null)
            {
                return false;
            }
            jobOffer.DeleteTimestamp = DateTime.Now;
            return _jobOfferRepository.Update(jobOffer);
        }
        public async Task<IEnumerable<JobOffer>> SearchJobOffersAsync(string? title, string? address, int? categoryId)
        {
            return await _jobOfferRepository.SearchJobOffersAsync(title, address, categoryId);
        }

        public async Task<IEnumerable<JobOffer>> GetJobOffersByCategoryIdAsync(int categoryId)
        {
            return await _jobOfferRepository.GetJobOffersByCategoryIdAsync(categoryId);
        }
        public async Task<IEnumerable<JobOffer>> GetJobOffersByTypeIdAsync(int jobTypeId)
        {
            return await _jobOfferRepository.GetJobOffersByTypeIdAsync(jobTypeId);
        }
        public async Task<IEnumerable<JobOffer>> GetRecentJobsAsyn()
        {
            return await _jobOfferRepository.GetRecentJobsAsync();
        }
        public async Task<IEnumerable<JobOfferCategories>> GetAllCategoriesAsync()
        {
            return await _jobOfferRepository.GetAllCategoriesAsync();
        }

        public async Task<IEnumerable<dynamic>> GetJobOffersCountByCategoryAsync()
        {
            return await _jobOfferRepository.GetJobOffersCountByCategoryAsync();
        }
        public async Task<IEnumerable<dynamic>> GetJobOfferCountByCompanyAsync()
        {
            return await _jobOfferRepository.GetJobOfferCountByCompanyAsync();
        }

    }
}
