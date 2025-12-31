using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class Experience
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Position { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string StartDate { get; set; } = string.Empty; // Format: "Month Year" or "Year"
    
    [MaxLength(50)]
    public string? EndDate { get; set; } // Format: "Month Year", "Year", or "Present"
    
    public bool IsCurrentPosition { get; set; } = false;
    
    public List<string> Description { get; set; } = new List<string>();
    
    // Foreign key to Resume
    public Guid ResumeId { get; set; }
    public Resume? Resume { get; set; }
    
    public int Order { get; set; } = 0; // For ordering experiences
}

