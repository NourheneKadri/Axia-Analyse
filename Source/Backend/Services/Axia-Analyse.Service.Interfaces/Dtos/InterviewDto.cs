using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class InterviewDto
    {
        public int CandidateId { get; set; }
        public int recruiterId { get; set; }

        public int SlotId { get; set; }
        public int JobId { get; set; }  // Clé étrangère

        public DateTime InterviewDate { get; set; }
        public TimeOnly InterviewTime { get; set; }
        public string Location { get; set; }
    }
}
