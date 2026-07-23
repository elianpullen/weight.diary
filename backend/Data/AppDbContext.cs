using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<BodyWeight> BodyWeights => Set<BodyWeight>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BodyWeight>(bodyweight =>
        {
            bodyweight.ToTable("bodyweights");

            bodyweight.HasKey(b => b.Id);

            bodyweight.HasIndex(b => b.Date)
                .IsUnique();

            bodyweight.Property(b => b.Date)
                .IsRequired();

            bodyweight.Property(b => b.Weight)
                .IsRequired()
                .HasPrecision(5, 2); // max 999.99
        });
    }
}