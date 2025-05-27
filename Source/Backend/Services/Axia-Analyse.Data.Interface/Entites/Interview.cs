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
        public int RecruiterId { get; set; }

        public int SlotId { get; set; }
        public int JobId { get; set; }  // Clé étrangère


        public DateTime InterviewDate { get; set; }
        public DateTime InterviewTime { get; set; }


        public string? Location { get; set; }
        public int StatusId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } // Nullable

    }
}
