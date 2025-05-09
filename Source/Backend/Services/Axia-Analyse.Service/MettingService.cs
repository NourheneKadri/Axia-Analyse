using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class MettingService : IMeetingService
    {
        private readonly IRestClient _restClient;
        private readonly ItokenService _tokenService;
        public MettingService(ItokenService tokenService)
        {
            this._restClient = new RestClient("https://www.googleapis.com/calendar/v3/calendars/");
            this._tokenService = tokenService;
          
        }
        public async Task<EventResponse> CreateEvent(EventRequest eventRequest)
        {
            // Vérifie si Start et End ne sont pas nuls avant de continuer
            if (eventRequest.Start == null || eventRequest.End == null)
            {
                throw new ArgumentNullException("Start and End times must be provided.");
            }

            var resrequest = new RestRequest("primary/events", Method.Post);

            // Récupérer le token d'accès
            var token = await this._tokenService.GetAccessToken();

            // Vérifier si le token est valide
            if (string.IsNullOrEmpty(token))
            {
                throw new UnauthorizedAccessException("Access token is missing or expired.");
            }

            // Ajouter le paramètre pour demander la conférence (Google Meet)
            resrequest.AddQueryParameter("conferenceDataVersion", "1");

            // Vérifier si les dates et heures sont valides
            if (eventRequest.Start.DateTime == null || eventRequest.End.DateTime == null)
            {
                throw new ArgumentException("Start and End DateTime must be provided.");
            }

            // Création du corps de la requête avec les détails de l'événement
            var eventData = new
            {
                summary = eventRequest.Summary,
                location = eventRequest.Location,
                description = eventRequest.Description,
                start = new
                {
                    dateTime = eventRequest.Start.DateTime,
                    timeZone = eventRequest.Start.TimeZone
                },
                end = new
                {
                    dateTime = eventRequest.End.DateTime,
                    timeZone = eventRequest.End.TimeZone
                },
                attendees = eventRequest.Attendees.Select(a => new { email = a.Email }).ToList(),
                reminders = eventRequest.Reminders,
                conferenceData = new
                {
                    createRequest = new
                    {
                        requestId = Guid.NewGuid().ToString(), // ID unique pour la conférence
                        conferenceSolutionKey = new { type = "hangoutsMeet" } // Demander Google Meet
                    }
                }
            };

            // Ajouter le corps JSON à la requête
            resrequest.AddJsonBody(eventData);

            // Ajouter l'en-tête d'autorisation
            resrequest.AddHeader("Authorization", $"Bearer {token}");

            // Envoi de la requête et obtenir la réponse
            var response = await this._restClient.PostAsync<EventResponse>(resrequest);

            // Vérifier que la réponse contient des données de conférence
            if (response.ConferenceData != null && response.ConferenceData.EntryPoints != null)
            {
                string googleMeetLink = response.ConferenceData.EntryPoints.FirstOrDefault()?.Uri;
                // Ajoute le lien Google Meet dans la réponse
                response.GoogleMeetLink = googleMeetLink;
            }

            // Retourner la réponse avec le lien Google Meet
            return response;
        }


        public Task DeleteEventAsync(string eventId)
        {
            throw new NotImplementedException();
        }

        public Task<EventResponse> GetEventById(string eventId)
        {
            throw new NotImplementedException();
        }

        public Task<List<EventResponse>> GetEventsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<EventResponse> UpdateEventAsync(string eventId, EventRequest eventRequest)
        {
            throw new NotImplementedException();
        }
    }
}
