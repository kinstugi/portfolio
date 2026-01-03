using System.Text.Json;
using CvBuilder.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CvBuilder.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Resume> Resumes { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<TailoredApplication> TailoredApplications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.FirstName).IsRequired();
            entity.Property(e => e.LastName).IsRequired();
            // PasswordHash is nullable for OAuth users
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            // Index for GoogleId lookup
            entity.HasIndex(e => e.GoogleId).IsUnique().HasFilter("[GoogleId] IS NOT NULL");
        });

        // Resume configuration
        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Relationship with User
            entity.HasOne(e => e.User)
                .WithMany(u => u.Resumes)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure JSON columns for lists (SQLite and PostgreSQL support)
            var listComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.Skills)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Metadata.SetValueComparer(listComparer);

            entity.Property(e => e.Certifications)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Metadata.SetValueComparer(listComparer);

            entity.Property(e => e.Languages)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Metadata.SetValueComparer(listComparer);
        });

        // Experience configuration
        modelBuilder.Entity<Experience>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Company).IsRequired();
            entity.Property(e => e.Position).IsRequired();
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.ResumeId).IsRequired();

            // Relationship with Resume
            entity.HasOne(e => e.Resume)
                .WithMany(r => r.Experiences)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure JSON column for Description list
            var descriptionComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.Description)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Metadata.SetValueComparer(descriptionComparer);
        });

        // Education configuration
        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Institution).IsRequired();
            entity.Property(e => e.Degree).IsRequired();
            entity.Property(e => e.ResumeId).IsRequired();

            // Relationship with Resume
            entity.HasOne(e => e.Resume)
                .WithMany(r => r.Educations)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Project configuration
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.ResumeId).IsRequired();

            // Relationship with Resume
            entity.HasOne(e => e.Resume)
                .WithMany(r => r.Projects)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure JSON column for Technologies list
            var technologiesComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            entity.Property(e => e.Technologies)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Metadata.SetValueComparer(technologiesComparer);
        });

        // TailoredApplication configuration
        modelBuilder.Entity<TailoredApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JobTitle).IsRequired();
            entity.Property(e => e.JobDescription).IsRequired();
            entity.Property(e => e.TailoredCvJson).IsRequired();
            entity.Property(e => e.CoverLetter).IsRequired();
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Relationship with User
            entity.HasOne(e => e.User)
                .WithMany(u => u.TailoredApplications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship with Resume (optional)
            entity.HasOne(e => e.BaseResume)
                .WithMany()
                .HasForeignKey(e => e.BaseResumeId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}

