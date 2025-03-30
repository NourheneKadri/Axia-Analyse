using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class JobOfferCandidancyDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public string? CVurl { get; set; }
        public IFormFile? CV { get; set; }

        public int CandidateProfileId { get; set; }
        public int JobOfferId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int StatusId { get; set; }
        public string? score { get; set; }



    }
}
