using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Axia_Analyse.Data.Interface.Entites;
using Axia_Analyse.Data.Interface.Constantes;


namespace Axia_Analyse.Data
{
    

        public class AxiaDbContext : DbContext
        {
            public AxiaDbContext(DbContextOptions<AxiaDbContext> options)
                : base(options)
            {
            }

            public DbSet<UserAccount> UserAccount { get; set; }
            public DbSet<Company> company { get; set; }
            public DbSet<JobOffer> JobOffer { get; set; }
            public DbSet<JobOfferCandidancy> JobOfferCandidancy { get; set; }
            public DbSet<JobOfferCategories> JobOfferCategories { get; set; }






    }
}
