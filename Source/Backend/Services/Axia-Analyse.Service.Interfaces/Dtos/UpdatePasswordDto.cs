using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class UpdatePasswordDto
    {
        public required string Email { get; set; }
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}
