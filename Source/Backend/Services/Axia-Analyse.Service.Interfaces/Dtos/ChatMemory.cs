using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class ChatMemory
    {
        public static List<(string role, string message)> History { get; set; } = new();

    }
}
