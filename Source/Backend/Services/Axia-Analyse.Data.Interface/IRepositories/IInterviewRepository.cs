using Axia_Analyse.Data.Interface.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Interface.IRepositories
{
    public interface IInterviewRepository
    {
        Task CreateInterviewAsync(Interview interview);
        Task<Interview> GetInterviewByIdAsync(int interviewId);
        Task UpdateInterviewAsync(Interview interview);
        Task DeleteInterviewAsync(int interviewId);
        Task<IEnumerable<Interview>> GetAllInterviewsAsync();

    }
}
