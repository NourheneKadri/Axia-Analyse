using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Service.Interfaces.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.DtoConversion
{
    public static class JobOfferDtoConversion
    {
        public static JobOffer ToEntity(JobOfferDto jboOfferDto, DateTime timestamp)
        {
            return new JobOffer
            {
                Title = jboOfferDto.Title,
                Description = jboOfferDto.Description,
                Adress = jboOfferDto.Adress,
                Requirements = jboOfferDto.Requirements,
                SalaryRange = jboOfferDto.SalaryRange,
                SkillsRequired = jboOfferDto.SkillsRequired,
                DeadlineTimestamp = jboOfferDto.DeadlineTimestamp,
                CategorieId = jboOfferDto.CategorieId,
                JobTypeId = jboOfferDto.JobTypeId,
                PostNumber = jboOfferDto.PostNumber,
                ExperienceLevel = jboOfferDto.ExperienceLevel,
                status = jboOfferDto.Status,
                UserAccountId = jboOfferDto.UserAccountId,
                Timestamp = timestamp


            };
        }
    }
}
