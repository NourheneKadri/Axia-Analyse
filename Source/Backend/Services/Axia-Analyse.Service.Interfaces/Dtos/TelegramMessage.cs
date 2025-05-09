using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class TelegramMessage
    {
        public long MessageId { get; set; }
        public TelegramUser From { get; set; }
        public long ChatId { get; set; }
        public string Text { get; set; }
    }
}
