using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class Interview : EntityBase
    {
        public int CandidateId { get; set; }
        public int SlotId { get; set; }
        public DateTime InterviewDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public UserAccount Candidate { get; set; }
        public Slot? Slot { get; set; }
    }
}
