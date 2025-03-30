using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class JobOfferCountByCompanyDto
    {
        public string CompanyName { get; set; }
        public int JobOfferCount { get; set; }
    }
}
