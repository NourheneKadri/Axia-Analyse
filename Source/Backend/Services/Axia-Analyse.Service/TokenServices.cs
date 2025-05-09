using Axia_Analyse.Service.Interfaces;
using Axia_Analyse.Service.Interfaces.Dtos;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class TokenServices : ItokenService
    {
        public readonly IRestClient restClient;
        private readonly IConfiguration configuration;
        private readonly string tokenFilePath = "C:\\Projects\\Axia Solutions\\Axia-Analyse\\Source\\Backend\\Services\\Axia-Analyse.Service\\token.json";
        public TokenServices(IConfiguration configuration) {
           this.restClient = new RestClient("https://oauth2.googleapis.com/token");
            this.configuration = configuration;
        }

        public async Task<string> GetAccessToken()
        {
            var token = this.GetToken();
            if (token.IsTokenExpired)
            {
                token = await this.RefreshTokenAsync();
            }

            return token.AccessToken;
         
        }

        public async Task<Token> GetTokenAsync(string code)
        {
            var restrequest = new RestRequest();
            restrequest.AddQueryParameter("code", code);
            restrequest.AddQueryParameter("client_id", this.configuration.GetValue<string>("clientId"));
            restrequest.AddQueryParameter("client_secret", this.configuration.GetValue<string>("clientsecret"));
            restrequest.AddQueryParameter("redirect_uri", this.configuration.GetValue<string>("RedirectionUrl"));
            restrequest.AddQueryParameter("grant_type", "authorization_code");
            restrequest.AddHeader("Content-Type", "application/json");

            var response = await this.restClient.PostAsync<Token>(restrequest);
            this.saveToken(response);
            return response;




        }

        private async Task<Token> RefreshTokenAsync()
        {
            var token = this.GetToken();
            var restrequest = new RestRequest();
            restrequest.AddQueryParameter("refresh_token", token.RefreshToken);
            restrequest.AddQueryParameter("client_id", this.configuration.GetValue<string>("clientId"));
            restrequest.AddQueryParameter("client_secret", this.configuration.GetValue<string>("clientsecret"));
            restrequest.AddQueryParameter("grant_type", "refresh_token");

            var response = await this.restClient.PostAsync<Token>(restrequest);
            response.RefreshToken = token.RefreshToken;
            this.saveToken(response); 

            return response;    
        }
        private void saveToken(Token token)
        {
            var json = JsonSerializer.Serialize(token);
            System.IO.File.WriteAllText(this.tokenFilePath, json);
        }
        private Token GetToken()
        {
            if (!System.IO.File.Exists(this.tokenFilePath))
                throw new Exception("Le fichier token.json n'existe pas.");

            var tokencontent = System.IO.File.ReadAllText(this.tokenFilePath);

            if (string.IsNullOrWhiteSpace(tokencontent))
                throw new Exception("Le fichier token.json est vide.");

            return JsonSerializer.Deserialize<Token>(tokencontent);
        }

    }
}
