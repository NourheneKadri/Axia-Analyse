using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.Entites
{
    public class Company : EntityBase
    {
        public string Name { get; set; }
        public string SIRET { get; set; }
        public string Phone { get; set; }
        public string adress { get; set; }

        public string Email { get; set; }
        public string LogoUrl { get; set; }
    }

}
