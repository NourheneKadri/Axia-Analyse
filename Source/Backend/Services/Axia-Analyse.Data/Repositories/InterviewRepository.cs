using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Data.Repositories
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly AxiaDbContext _context;

        public InterviewRepository(AxiaDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Interview>> GetAllInterviewsAsync()
        {
            return await _context.Interview.ToListAsync();
        }
        public async Task CreateInterviewAsync(Interview interview)
        {
            _context.Interview.Add(interview);
            await _context.SaveChangesAsync();
        }

        public async Task<Interview> GetInterviewByIdAsync(int interviewId)
        {
            return await _context.Interview.FindAsync(interviewId);
        }

        public async Task UpdateInterviewAsync(Interview interview)
        {
            _context.Interview.Update(interview);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInterviewAsync(int interviewId)
        {
            var interview = await GetInterviewByIdAsync(interviewId);
            if (interview != null)
            {
                _context.Interview.Remove(interview);
                await _context.SaveChangesAsync();
            }
        }
    }
}
