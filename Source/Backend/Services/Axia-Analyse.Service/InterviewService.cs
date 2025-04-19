using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Axia_Analyse.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;

        public InterviewService(IInterviewRepository interviewRepository)
        {
            _interviewRepository = interviewRepository;
        }

        public async Task CreateInterviewAsync(Interview interview)
        {
            // Logique métier avant la création de l'entretien
            // Par exemple, vérifier la disponibilité du créneau horaire
            await _interviewRepository.CreateInterviewAsync(interview);
        }

        public async Task<Interview> GetInterviewByIdAsync(int interviewId)
        {
            return await _interviewRepository.GetInterviewByIdAsync(interviewId);
        }

        public async Task UpdateInterviewAsync(Interview interview)
        {
            // Logique métier avant la mise à jour
            await _interviewRepository.UpdateInterviewAsync(interview);
        }

        public async Task DeleteInterviewAsync(int interviewId)
        {
            await _interviewRepository.DeleteInterviewAsync(interviewId);
        }
    }
}
