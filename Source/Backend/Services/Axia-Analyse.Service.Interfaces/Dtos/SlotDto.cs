using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class SlotDto
    {
        public DateTime SlotDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int RecruiterId { get; set; }
    }
}
