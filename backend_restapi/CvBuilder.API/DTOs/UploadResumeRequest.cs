using System.ComponentModel.DataAnnotations;

namespace CvBuilder.API.DTOs;

public class UploadResumeRequest
{
    [Required]
    public IFormFile CvFile { get; set; } = null!;
}

