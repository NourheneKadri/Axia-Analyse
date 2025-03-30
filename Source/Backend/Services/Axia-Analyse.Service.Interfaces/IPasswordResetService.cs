using Axia_Analyse.Service;


namespace Axia_Analyse.Service.Interfaces
{
    public interface IPasswordResetService
    {
        Task<Result> ResetPasswordAsync(string emailAddress);
    }
}