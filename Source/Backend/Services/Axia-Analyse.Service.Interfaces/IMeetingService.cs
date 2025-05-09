using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IMeetingService
    {
        Task<EventResponse> CreateEvent(EventRequest eventRequest);
        Task DeleteEventAsync(string eventId);
        Task<EventResponse> GetEventById (string eventId);
        Task<List<EventResponse>> GetEventsAsync();
        Task<EventResponse> UpdateEventAsync(string eventId , EventRequest eventRequest);
    }
}
