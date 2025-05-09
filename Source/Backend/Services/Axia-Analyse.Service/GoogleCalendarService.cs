using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class GoogleCalendarService
    {
        private readonly HttpClient _httpClient;
        private readonly IAuthentificationService _authentificationService;

        public GoogleCalendarService(HttpClient httpClient, IAuthentificationService authentificationService)
        {
            _httpClient = httpClient;
            _authentificationService = authentificationService;
        }

        public async Task<string?> CreateGoogleMeetEventAsync(string accessToken, InterviewDto interview)
        {
            var requestUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1";
            var candidate = await _authentificationService.GetUserAccountByIdAsync(interview.CandidateId);

            var start = interview.InterviewDate.Date + interview.InterviewTime.ToTimeSpan();
            var end = start.AddMinutes(30);

            var json = $@"
        {{
            ""summary"": ""Entretien de recrutement"",
            ""description"": ""Entretien prévu pour le poste ID {interview.JobId}"",
            ""start"": {{
                ""dateTime"": ""{start:yyyy-MM-ddTHH:mm:sszzz}"",
                ""timeZone"": ""Africa/Tunis""
            }},
            ""end"": {{
                ""dateTime"": ""{end:yyyy-MM-ddTHH:mm:sszzz}"",
                ""timeZone"": ""Africa/Tunis""
            }},
            ""attendees"": [
                {{ ""email"": ""{candidate.Email}"" }}
            ],
            ""conferenceData"": {{
                ""createRequest"": {{
                    ""requestId"": ""entretien-{Guid.NewGuid()}"",
                    ""conferenceSolutionKey"": {{
                        ""type"": ""hangoutsMeet""
                    }}
                }}
            }}
        }}";

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.PostAsync(requestUrl, content);
            var body = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var meetLink = JsonDocument.Parse(body)
                    .RootElement.GetProperty("hangoutLink").GetString();
                return meetLink;
            }

            return null;
        }
    }

}
