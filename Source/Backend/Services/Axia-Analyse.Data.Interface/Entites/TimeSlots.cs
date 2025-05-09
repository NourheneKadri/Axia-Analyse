using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class TimeSlots : EntityBase
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int RecruiterId { get; set; }
    }
}
