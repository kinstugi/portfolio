namespace CvBuilder.API.DTOs;

public class UpdateResumeRequest
{
    public string? Name { get; set; }
    public string? Location { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? GitHub { get; set; }
    public string? LinkedIn { get; set; }
    public string? Portfolio { get; set; }
    public string? Image { get; set; }
    public string? Summary { get; set; }
    public List<string>? Skills { get; set; }
    public List<string>? Certifications { get; set; }
    public List<string>? Languages { get; set; }
    public List<ExperienceDto>? Experiences { get; set; }
    public List<EducationDto>? Educations { get; set; }
    public List<ProjectDto>? Projects { get; set; }
    public string? Title { get; set; }
}

