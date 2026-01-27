using Microsoft.EntityFrameworkCore;
using UpBizlyBackend.Models;

namespace UpBizlyBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Business> Businesses => Set<Business>();
        public DbSet<Product> Products => Set<Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ----------------------
            // Seed Users with static hashed passwords
            // ----------------------
            modelBuilder.Entity<User>().HasData(
    new User
    {
        Id = 1,
        Username = "admin",
        PasswordHash = "$2a$11$8yR9rdgbNq.k72phFKVvo.3/OmQq.9dis/oz/p9ZMNDq/5Z4czstO", // Admin@123
        Role = "Admin"
    },
    new User
    {
        Id = 2,
        Username = "owner",
        PasswordHash = "$2a$12$Ft1a6N/DX7CkX1zP7V2gC.7S5gq9IkVxe4E6D27A/2rTXgOXq8fpa", // Owner@123 (optional: can regenerate too)
        Role = "Business"
    }
);


            // ----------------------
            // Fix Product.Price decimal warning
            // ----------------------
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
