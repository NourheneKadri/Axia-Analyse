using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Axia_Analyse.Data;
using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var issuer = configuration["Issuer"];
var audience = configuration["Audience"];

// Add services to the container.

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWTSecretKey"])
            
            ),
            ClockSkew = TimeSpan.Zero  // Pour éviter les petits écarts de temps

        };
        options.IncludeErrorDetails = true;
    });

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

// Ajout des services au conteneur DI
builder.Services.AddSingleton<CloudinaryService>();



builder.Services.AddScoped<IAuthentificationService, Axia_Analyse.Service.AuthenticationService>();
builder.Services.AddScoped<MailNotificationService>();// Register the interface with its implementation
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IPasswordResetService, PasswordResetService>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IJobOfferRepository, JobOfferRepository>();
builder.Services.AddScoped<IJobOfferService, JobOfferServices>();
builder.Services.AddScoped<IJobOfferCandidancyService, JobOfferCandidancyService>();
builder.Services.AddScoped<IJobOfferCandidancyRepository, JobOfferCandidancyRepository>();
builder.Services.AddSingleton<CloudinaryService>();

builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IInterviewRepository, InterviewRepository>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();

// Services
builder.Services.AddScoped<IInterviewService, InterviewService>();
builder.Services.AddScoped<ISlotService, SlotService>();




builder.Services.AddScoped<EmailSender>();



builder.Services.AddDbContext<AxiaDbContext>(options =>
         options.UseSqlServer(builder.Configuration.GetConnectionString("TalentPortal")));



builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddScoped<PdfService>();
builder.Services.AddScoped<GeminiService>();



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<BCryptPasswordHasher>();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
   .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    // By default, all incoming requests will be authorized according to the default policy.
    options.FallbackPolicy = options.DefaultPolicy;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:3039") // Autorise ton frontend React
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Si tu utilises des cookies ou tokens
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization(); // Assure que l'auth est appliquée sauf pour AllowAnonymous

app.Run();
