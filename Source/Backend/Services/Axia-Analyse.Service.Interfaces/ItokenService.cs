using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface ItokenService
    {
        Task<Token> GetTokenAsync(string code);
        Task<string> GetAccessToken();
    }
}
