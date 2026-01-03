using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    public string? PasswordHash { get; set; } // Nullable for OAuth users
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsEmailVerified { get; set; } = false;
    
    // OAuth fields
    public string? GoogleId { get; set; }
    public string? Provider { get; set; } // "google" or "local"
    
    // Navigation property for resumes
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    
    // Navigation property for tailored applications
    public ICollection<TailoredApplication> TailoredApplications { get; set; } = new List<TailoredApplication>();
}

