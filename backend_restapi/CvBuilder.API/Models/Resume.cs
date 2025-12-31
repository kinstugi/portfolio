using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty; // Full name
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [EmailAddress]
    [MaxLength(255)]
    public string? Email { get; set; }
    
    [MaxLength(50)]
    public string? Phone { get; set; }
    
    [MaxLength(500)]
    public string? GitHub { get; set; }
    
    [MaxLength(500)]
    public string? LinkedIn { get; set; }
    
    [MaxLength(500)]
    public string? Portfolio { get; set; }
    
    [MaxLength(1000)]
    public string? Image { get; set; } // URL or file path
    
    [MaxLength(2000)]
    public string? Summary { get; set; }
    
    public List<string> Skills { get; set; } = new List<string>();
    
    public List<string> Certifications { get; set; } = new List<string>();
    
    public List<string> Languages { get; set; } = new List<string>();
    
    // Navigation properties
    public ICollection<Experience> Experiences { get; set; } = new List<Experience>();
    
    public ICollection<Education> Educations { get; set; } = new List<Education>();
    
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    
    // Foreign key to User
    [Required]
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsDefault { get; set; } = false; // Mark as default resume for user
    
    [MaxLength(200)]
    public string? Title { get; set; } // Optional title/name for the resume version
}

