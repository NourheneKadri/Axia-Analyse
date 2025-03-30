using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class JobOffer : EntityBase
    {



        public string Title { get; set; }
        public string Description { get; set; }
        public string Adress { get; set; }
        public string Requirements { get; set; }
        public string SalaryRange { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime DeadlineTimestamp { get; set; }
        public int JobTypeId { get; set; }
        public int CategorieId { get; set; }
        public int PostNumber { get; set; }
        public string ExperienceLevel { get; set; }
        public string SkillsRequired { get; set; }
        public int UserAccountId { get; set; }
        public DateTime? DeleteTimestamp { get; set; }
        public string status { get; set; }
        public UserAccount UserAccount { get; set; }



    }

}
