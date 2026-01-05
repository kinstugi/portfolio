namespace CvBuilder.API.DTOs;

public class UserProfileResponse
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Language { get; set; } = "English";
    public string TimeZone { get; set; } = string.Empty;
}

