using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    // EventRequest : pour envoyer une requête de création d'événement
    public class EventRequest
    {
        public string EventType { get; set; } = "default";
        public string Transparency { get; set; } = "opaque";
        public string Status { get; set; } = "confirmed";
        public string Visibility { get; set; } = "default";

        public string? Summary { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public EventTime? Start { get; set; }
        public EventTime? End { get; set; }
        public string[]? Recurrence { get; set; }
        public EventAttendee[]? Attendees { get; set; }
        public RemindersData? Reminders { get; set; }
        public ConferenceData? ConferenceDataa { get; set; }

        public class EventTime
        {
            public DateTime? DateTime { get; set; }
            public string? TimeZone { get; set; }
        }

        public class EventAttendee
        {
            public string? Email { get; set; }
        }

        public class EventReminder
        {
            public string? Method { get; set; }
            public int Minutes { get; set; }
        }

        public class RemindersData
        {
            public bool UseDefault { get; set; }
            public EventReminder[]? Overrides { get; set; }
        }

        public class ConferenceData
        {
            public CreateRequest? CreateRequest { get; set; }
        }

        public class CreateRequest
        {
            public string? RequestId { get; set; }
            public ConferenceSolutionKey? ConferenceSolutionKey { get; set; }
        }

        public class ConferenceSolutionKey
        {
            public string? Type { get; set; } = "hangoutsMeet";
        }
    }
}
