using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class TailoredApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string JobTitle { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? CompanyName { get; set; }
    
    [Required]
    public string JobDescription { get; set; } = string.Empty; // Full JD text
    
    [Required]
    public string TailoredCvJson { get; set; } = string.Empty; // Tailored CV as JSON string
    
    [Required]
    public string CoverLetter { get; set; } = string.Empty;
    
    // Foreign key to User
    [Required]
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    // Foreign key to Resume (the base resume used)
    public Guid? BaseResumeId { get; set; }
    public Resume? BaseResume { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

