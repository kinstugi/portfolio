namespace CvBuilder.API.DTOs;

public class TailorApplicationResponse
{
    public Guid Id { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public object TailoredCv { get; set; } = new { };
    public string CoverLetter { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

