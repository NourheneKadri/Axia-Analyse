using Axia_Analyse.Data.Interface.Entites;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class UserAccountDto
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? AboutMe { get; set; }



        public IFormFile? PhotoLogo { get; set; }
        public string? PhotoLogoUrl { get; set; }

    }
}
