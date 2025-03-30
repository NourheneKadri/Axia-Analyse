using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class JobOfferCandidancy : EntityBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int CandidateProfileId { get; set; }
        public int? JobOfferId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int StatusId { get; set; }
        public string CVurl { get; set; }
        public string? score { get; set; }
        public JobOffer? JobOffer { get; set; } 







    }
}
