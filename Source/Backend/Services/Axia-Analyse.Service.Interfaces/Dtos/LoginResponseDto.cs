using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class LoginResponseDto
    {

        public required string Email { get; set; }
        public required string Token { get; set; }
        public int UserAccountId { get; set; }

        public int AppRoleId { get; set; }




    }
}
