using Axia_Analyse.Service.Interfaces;
using Microsoft.AspNetCore.Authentication;
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
using Microsoft.Extensions.FileSystemGlobbing.Internal;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;


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
            
            IssuerSigningKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("bRhYJRlZvBj2vW4MrV5HVdPgIE6VMtCFB0kTtJ1m") // doit être IDENTIQUE
),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                // Log l'erreur
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                // Log la réponse de challenge
                Console.WriteLine("Challenge failed: " + context.Error);
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddControllers();



builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

// Ajout des services au conteneur DI
builder.Services.AddSingleton<CloudinaryService>();



builder.Services.AddScoped<IAuthentificationService, Axia_Analyse.Service.AuthenticationService>();
builder.Services.AddScoped<MailNotificationService>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IPasswordResetService, PasswordResetService>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IJobOfferRepository, JobOfferRepository>();
builder.Services.AddScoped<IJobOfferService, JobOfferServices>();
builder.Services.AddScoped<IJobOfferCandidancyService, JobOfferCandidancyService>();
builder.Services.AddScoped<IJobOfferCandidancyRepository, JobOfferCandidancyRepository>();

builder.Services.AddScoped<ITelegramService, TelegramService>();

builder.Services.AddSingleton<CloudinaryService>();
builder.Services.AddScoped<GoogleCalendarService>();
builder.Services.AddScoped<GoogleAuthService>();
builder.Services.AddHttpClient();




builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IInterviewRepository, InterviewRepository>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();
builder.Services.AddScoped<ItokenService, TokenServices>();
builder.Services.AddScoped<IMeetingService, MettingService>();


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
app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    Console.WriteLine($"[DEBUG] Authorization header: {authHeader}");
    await next();
});

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"

);


app.Run();
