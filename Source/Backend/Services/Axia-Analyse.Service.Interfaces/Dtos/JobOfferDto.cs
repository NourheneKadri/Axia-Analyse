using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class JobOfferDto
    {

        public string Title { get; set; }
        public string Description { get; set; }
        public string Adress { get; set; }
        public string Requirements { get; set; }
        public string SalaryRange { get; set; }

        public DateTime DeadlineTimestamp { get; set; }
        public int JobTypeId { get; set; }
        public int CategorieId { get; set; }
        public int PostNumber { get; set; }
        public string ExperienceLevel { get; set; }
        public string SkillsRequired { get; set; }
        public int UserAccountId { get; set; }

        public string Status { get; set; }

        public static object ToEntity(JobOfferDto jobOfferDto, DateTime now)
        {
            throw new NotImplementedException();
        }
    }
}
