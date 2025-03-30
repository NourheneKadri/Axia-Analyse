using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class UserAccountLoginDto
    {

        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
