using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Repositories
{
    public class JobOfferRepository : IJobOfferRepository
    {
        private readonly AxiaDbContext _dbContext;

        public JobOfferRepository(AxiaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public JobOffer GetById(int id)
        {
            return _dbContext.JobOffer
                .Where(jobOffer => jobOffer.Id == id)
                .FirstOrDefault();
        }

        public IEnumerable<JobOffer> GetAll()
        {
            var now = DateTime.UtcNow;

            // 1. On récupère toutes les offres non supprimées
            var offers = _dbContext.JobOffer
                .Where(e => e.DeleteTimestamp == null)
                .ToList();

            // 2. On met à jour les offres expirées
            foreach (var offer in offers)
            {
                if (offer.DeadlineTimestamp <= now && offer.status != "Expired")
                {
                    offer.status = "Expired";
                }
            }

            // 3. On sauvegarde les changements (important !)
            _dbContext.SaveChanges();

            return offers;
        }


        public bool Add(JobOffer jobOffer)
        {
            var success = false;
            if (jobOffer != null)
            {
                try
                {
                    _dbContext.JobOffer.Add(jobOffer);
                    _dbContext.SaveChanges();
                    success = true;
                }
                catch
                {
                    // Handle the exception as needed
                }
            }
            return success;
        }

        public bool Update(JobOffer jobOffer)
        {
            var success = false;
            var oldJobOffer = GetById(jobOffer.Id);
            if (oldJobOffer != null)
            {
                try
                {
                    _dbContext.Entry<JobOffer>(oldJobOffer).CurrentValues.SetValues(jobOffer);
                    _dbContext.SaveChanges();
                    success = true;
                }
                catch
                {
                    // Handle the exception as needed
                }
            }
            return success;
        }

        public bool Delete(int id)
        {
            var success = false;
            var jobOffer = GetById(id);
            if (jobOffer != null)
            {
                try
                {
                    _dbContext.JobOffer.Remove(jobOffer);
                    _dbContext.SaveChanges();
                    success = true;
                }
                catch
                {
                    // Handle the exception as needed
                }
            }
            return success;
        }
        public async Task<IEnumerable<JobOffer>> SearchJobOffersAsync(string? title, string? address, int? categoryId)
        {
            return await _dbContext.JobOffer
                .Join(_dbContext.UserAccount, jo => jo.UserAccountId, ua => ua.Id, (jo, ua) => new { jo, ua })
                .Join(_dbContext.company, temp => temp.ua.CompanyId, c => c.Id, (temp, c) => new { temp.jo, CompanyName = c.Name })
                .Where(jc =>
                    (string.IsNullOrEmpty(title) ||
                     jc.jo.Title.ToLower().Contains(title.ToLower()) ||
                     jc.jo.Description.ToLower().Contains(title.ToLower()) ||
                     jc.CompanyName.ToLower().Contains(title.ToLower())) &&
                    (string.IsNullOrEmpty(address) || jc.jo.Adress.ToLower().Contains(address.ToLower())) &&
                    (!categoryId.HasValue || jc.jo.CategorieId == categoryId) &&
                    jc.jo.DeleteTimestamp == null // Filtrage pour ne sélectionner que les offres actives
                )
                .Select(jc => jc.jo)
                .ToListAsync();
        }


        public async Task<IEnumerable<JobOffer>> GetJobOffersByCategoryIdAsync(int categoryId)
        {
            return await _dbContext.JobOffer
                .Where(jo => jo.CategorieId == categoryId && jo.DeleteTimestamp == null)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobOffer>> GetJobOffersByTypeIdAsync(int jobTypeId)
        {
            return await _dbContext.JobOffer
                .Where(jo => jo.JobTypeId == jobTypeId && jo.DeleteTimestamp == null)
                .ToListAsync();
        }
        public async Task<List<JobOffer>> GetRecentJobsAsync()
        {
            return await _dbContext.JobOffer
                                 .OrderByDescending(j => j.Timestamp)
                                 .Take(4)
                                 .ToListAsync();
        }
        public async Task<IEnumerable<JobOfferCategories>> GetAllCategoriesAsync()
        {
            return await _dbContext.JobOfferCategories.ToListAsync();
        }

        public async Task<IEnumerable<dynamic>> GetJobOffersCountByCategoryAsync()
        {
            var result = await _dbContext.JobOffer
                .Where(j => j.DeleteTimestamp==null)
                .GroupBy(j => j.CategorieId)
                .Select(g => new
                {
                    CategoryId = g.Key,
                    JobCount = g.Count()
                })
                .ToListAsync();

            return result;
        }

        public async Task<IEnumerable<dynamic>> GetJobOfferCountByCompanyAsync()
        {
            var result = await _dbContext.company
                .Select(c => new
                {
                    CompanyName = c.Name,
                    JobOfferCount = _dbContext.JobOffer
                        .Count(j => _dbContext.UserAccount
                            .Any(u => u.Id == j.UserAccountId && u.CompanyId == c.Id)
                            && j.DeleteTimestamp == null && j.status =="active")  // Exclure les offres supprimées
                })
                .ToListAsync();

            return result;
        }
        public List<JobOffer> GetJobOffersByUserAccountId(int userAccountId)
        {
            return _dbContext.JobOffer
                           .Where(j => j.UserAccountId == userAccountId)
                           .ToList();
        }

        public IEnumerable<JobOffer> GetActiveJobOffers()
        {
            return _dbContext.JobOffer
                .Where(e => e.status == "active" && e.DeleteTimestamp == null)
                .ToList();
        }
        public async Task<List<string>> GetTitleSuggestionsAsync(string query)
        {
            return await _dbContext.JobOffer
                .Where(j => j.DeleteTimestamp == null &&
                            j.status == "active" &&
                            (j.Title.ToLower().Contains(query.ToLower()) ||
                             j.Description.ToLower().Contains(query.ToLower())))
                .Select(j => j.Title)
                .Distinct()
                .Take(10)
                .ToListAsync();
        }
        public async Task<IEnumerable<JobOffer>> GetActiveJobOffersByCompanyId(int companyId)
        {
            return await _dbContext.JobOffer
                .Include(j => j.UserAccount)
                .Where(j => j.status=="active" && j.UserAccount.CompanyId == companyId)
                .ToListAsync();
        }

        public JobOffer Find(Expression<Func<JobOffer, bool>> predicate)
        {
            return _dbContext.JobOffer.FirstOrDefault(predicate);
        }


    }
}
