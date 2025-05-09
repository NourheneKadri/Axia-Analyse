using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class EventResponse
    {
        public string Id { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public EventRequest.EventTime Start { get; set; }
        public EventRequest.EventTime End { get; set; }

        [JsonPropertyName("conferenceData")] // ⬅️ Utilisation dans la réponse
        public ConferenceDataResponse ConferenceData { get; set; }
        public string GoogleMeetLink { get; set; }

    }

    public class ConferenceDataResponse // Réponse de Google Calendar contenant les détails de la conférence
    {
        [JsonPropertyName("entryPoints")]
        public List<EntryPoint> EntryPoints { get; set; }

        public class EntryPoint
        {
            public string EntryPointType { get; set; }  // "video" pour Meet
            public string Uri { get; set; }             // Lien Google Meet
        }
    }
}
