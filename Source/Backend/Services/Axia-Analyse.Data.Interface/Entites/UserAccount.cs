using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class UserAccount : EntityBase
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int AppRoleId { get; set; }

        public int? CompanyId { get; set; }
        public Company? Company { get; set; }

    }
}
