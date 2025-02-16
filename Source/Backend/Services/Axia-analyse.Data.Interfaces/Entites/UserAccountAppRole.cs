using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Entites
{
    public class UserAccountAppRole : EntityBase
    {
        public int UserAccountId { get; set; }
        public int AppRoleId { get; set; }
    }
}
