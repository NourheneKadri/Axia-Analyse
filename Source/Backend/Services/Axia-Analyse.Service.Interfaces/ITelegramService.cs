using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface ITelegramService
    {
        Task<string> SendMessageAsync(string chatId, string message);
        Task SetWebhookAsync();

    }
}
