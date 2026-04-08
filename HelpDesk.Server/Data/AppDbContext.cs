using HelpDesk.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace HelpDesk.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext (DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Departement> Departements => Set<Departement>();
        public DbSet<AppUser> AppUsers => Set<AppUser>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<TicketComment> TicketComments => Set<TicketComment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Ticket>()
                .HasOne(t=>t.CreatedByUser)
                .WithMany()
                .HasForeignKey(t=>t.CreatedByUserId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<TicketComment>()
                .HasOne<Ticket>(tc=>tc.Ticket)
                .WithMany(t=>t.Comments)
                .HasForeignKey(t=>t.TicketId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<TicketComment>()
                .HasOne(tc=>tc.User)
                .WithMany()
                .HasForeignKey(tc=>tc.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
