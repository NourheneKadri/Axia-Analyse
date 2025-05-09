using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces
{
    public interface IInterviewService
    {
        Task CreateInterviewAsync(InterviewDto interview);
        Task<Interview> GetInterviewByIdAsync(int interviewId);
        Task UpdateInterviewAsync(Interview interview);
        Task DeleteInterviewAsync(int interviewId);
        Task<IEnumerable<Interview>> GetAllInterviewsAsync();

    }
}
