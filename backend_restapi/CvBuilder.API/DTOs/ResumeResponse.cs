namespace CvBuilder.API.DTOs;

public class ResumeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? GitHub { get; set; }
    public string? LinkedIn { get; set; }
    public string? Portfolio { get; set; }
    public string? Image { get; set; }
    public string? Summary { get; set; }
    public List<string> Skills { get; set; } = new List<string>();
    public List<string> Certifications { get; set; } = new List<string>();
    public List<string> Languages { get; set; } = new List<string>();
    public List<ExperienceDto> Experiences { get; set; } = new List<ExperienceDto>();
    public List<EducationDto> Educations { get; set; } = new List<EducationDto>();
    public List<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
    public bool IsDefault { get; set; }
    public string? Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ExperienceDto
{
    public Guid Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public bool IsCurrentPosition { get; set; }
    public List<string> Description { get; set; } = new List<string>();
}

public class EducationDto
{
    public Guid Id { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string? Field { get; set; }
    public string? Location { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
}

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Technologies { get; set; } = new List<string>();
    public string? Url { get; set; }
}

