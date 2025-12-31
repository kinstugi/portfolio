namespace CvBuilder.API.DTOs;

public class JobDescriptionResponse
{
    public Guid Id { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public object TailoredCv { get; set; } = new { }; // Tailored CV as JSON object
    public string CoverLetter { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

