using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Axia_Analyse.Data.Interface.Entites;



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
        public DbSet<Slot> Slot { get; set; }
        public DbSet<Interview> Interview { get; set; }
        public DbSet<TimeSlots> TimeSlots { get; set; }



        // Configuration personnalisée ici
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Interview>()
                .Property(i => i.InterviewDate);

            modelBuilder.Entity<Interview>()
                .Property(i => i.InterviewTime);
        }

    }
}
