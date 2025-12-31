using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.Models;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public List<string> Technologies { get; set; } = new List<string>();
    
    [MaxLength(500)]
    public string? Url { get; set; }
    
    // Foreign key to Resume
    public Guid ResumeId { get; set; }
    public Resume? Resume { get; set; }
    
    public int Order { get; set; } = 0; // For ordering projects
}

