using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class Education
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Degree { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Field { get; set; }
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [MaxLength(50)]
    public string? StartDate { get; set; } // Format: "Year"
    
    [MaxLength(50)]
    public string? EndDate { get; set; } // Format: "Year"
    
    // Foreign key to Resume
    public Guid ResumeId { get; set; }
    public Resume? Resume { get; set; }
    
    public int Order { get; set; } = 0; // For ordering education entries
}

