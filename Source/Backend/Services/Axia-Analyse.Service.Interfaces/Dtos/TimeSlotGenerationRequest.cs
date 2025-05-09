using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class TimeSlotGenerationRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int RecruiterId { get; set; }


        public int InterviewDurationMinutes { get; set; }
    }
}
