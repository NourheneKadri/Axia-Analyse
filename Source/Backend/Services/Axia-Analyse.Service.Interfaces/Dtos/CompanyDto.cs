using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class CompanyDto
    {
        
        public string Name { get; set; }
        public string SIRET { get; set; }
        public string Phone { get; set; }
        public string adress { get; set; }

        public string Email { get; set; }
        public IFormFile? Logo { get; set; }

        public string? LogoUrl { get; set; }
    }
}

