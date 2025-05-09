using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class TelegramMessageDto
    {
        public string ChatId { get; set; }
        public string Message { get; set; }
    }
}
