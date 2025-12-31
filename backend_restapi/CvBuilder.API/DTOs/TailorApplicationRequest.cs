using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.DTOs;

public class TailorApplicationRequest
{
    [Required]
    [MaxLength(10000)]
    public string JobDescription { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? ImageUrl { get; set; } // Optional image URL for CV
}

