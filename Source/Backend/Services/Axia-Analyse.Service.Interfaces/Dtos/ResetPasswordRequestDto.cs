using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class ResetPasswordRequest
    {
        public required string Email { get; set; }
    }

}
