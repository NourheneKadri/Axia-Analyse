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

        public async Task<string?> CreateGoogleMeetEvent(string accessToken, InterviewDto interview)
        {
            // Crée un EventRequest en utilisant les données d'interview

            var candidate = await _authentificationService.GetUserAccountByIdAsync(interview.CandidateId);
            var recruteur  = await _authentificationService.GetUserAccountByIdAsync(interview.recruiterId);
            var eventRequest = new EventRequest
            {
                Summary = "Entretien avec le candidat",
                Location = interview.Location,
                Description = "Entretien pour le poste",
                Start = new EventRequest.EventTime
                {
                    DateTime = interview.InterviewDate.Add(interview.InterviewTime.ToTimeSpan()),
                    TimeZone = "Europe/Paris" // Remplace par le fuseau horaire correct
                },
                End = new EventRequest.EventTime
                {
                    DateTime = interview.InterviewDate.Add(interview.InterviewTime.ToTimeSpan()).AddMinutes(30), // Durée de 30 minutes par exemple
                    TimeZone = "Europe/Paris"
                },
                Attendees = new[]
                {
                new EventRequest.EventAttendee { Email = candidate.Email }, // Assure-toi de récupérer l'email du candidat
                new EventRequest.EventAttendee { Email = recruteur.Email }, // Assure-toi de récupérer l'email du recruteur
            },
                ConferenceDataa = new EventRequest.ConferenceData
                {
                    CreateRequest = new EventRequest.CreateRequest
                    {
                        RequestId = Guid.NewGuid().ToString(),
                        ConferenceSolutionKey = new EventRequest.ConferenceSolutionKey
                        {
                            Type = "hangoutsMeet"
                        }
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(eventRequest);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1")
            {
                Content = content
            };

            requestMessage.Headers.Add("Authorization", $"Bearer {accessToken}");

            var response = await _httpClient.SendAsync(requestMessage);
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var createdEvent = JsonSerializer.Deserialize<JsonElement>(responseContent);
                string? meetLink = null;

                if (createdEvent.ValueKind != JsonValueKind.Undefined && createdEvent.TryGetProperty("hangoutLink", out JsonElement hangoutLinkElement))
                {
                    meetLink = hangoutLinkElement.GetString();
                }
                return meetLink;
            }

            return null;
        }
    }

}
