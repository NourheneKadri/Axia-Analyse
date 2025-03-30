using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class UserAccountRegisterDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        public int AppRoleId { get; set; }
        public int? companyId { get; set; }


    }
}
