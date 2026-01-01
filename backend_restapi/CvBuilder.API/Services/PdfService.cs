using System.Text.Json;
using CvBuilder.API.Models;
using CvBuilder.API.Templates.CvTemplates;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CvBuilder.API.Services;

public class PdfService : IPdfService
{
    private readonly ILogger<PdfService> _logger;

    public PdfService(ILogger<PdfService> logger)
    {
        _logger = logger;
        // Set QuestPDF license (Community is free, Commercial requires license)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public Task<byte[]> GenerateResumePdfAsync(Resume resume, int templateNumber = 1)
    {
        try
        {
            _logger.LogInformation($"Generating PDF for resume: {resume.Id} using template {templateNumber}");

            var document = Document.Create(container =>
            {
                switch (templateNumber)
                {
                    case 1:
                        new Template1().Compose(container, resume);
                        break;
                    case 2:
                        new Template2().Compose(container, resume);
                        break;
                    case 3:
                        new Template3().Compose(container, resume);
                        break;
                    case 4:
                        new Template4().Compose(container, resume);
                        break;
                    default:
                        new Template1().Compose(container, resume);
                        break;
                }
            });

            var pdfBytes = document.GeneratePdf();
            return Task.FromResult(pdfBytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating PDF");
            throw;
        }
    }

    public async Task<byte[]> GenerateTailoredApplicationPdfAsync(TailoredApplication tailoredApplication, int templateNumber = 1)
    {
        try
        {
            _logger.LogInformation($"Generating PDF for tailored application: {tailoredApplication.Id}");

            // Parse the tailored CV JSON from the TailoredApplication
            var tailoredCvJson = tailoredApplication.TailoredCvJson;
            var cvData = JsonSerializer.Deserialize<Dictionary<string, object>>(tailoredCvJson);
            
            if (cvData == null)
            {
                throw new InvalidOperationException("Failed to parse tailored CV JSON");
            }

            // Create a temporary Resume object from the JSON (similar to MapToResume in AiService)
            var resume = MapJsonToResume(cvData);
            
            // Generate PDF using the same method with template number
            return await GenerateResumePdfAsync(resume, templateNumber);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating tailored application PDF");
            throw;
        }
    }

    private Resume MapJsonToResume(Dictionary<string, object> data)
    {
        var resume = new Resume();

        if (data.TryGetValue("name", out var name))
            resume.Name = name?.ToString() ?? "";
        if (data.TryGetValue("location", out var location))
            resume.Location = location?.ToString();
        if (data.TryGetValue("email", out var email))
            resume.Email = email?.ToString();
        if (data.TryGetValue("phone", out var phone))
            resume.Phone = phone?.ToString();
        if (data.TryGetValue("github", out var github))
            resume.GitHub = github?.ToString();
        if (data.TryGetValue("linkedin", out var linkedin))
            resume.LinkedIn = linkedin?.ToString();
        if (data.TryGetValue("portfolio", out var portfolio))
            resume.Portfolio = portfolio?.ToString();
        if (data.TryGetValue("image", out var image))
            resume.Image = image?.ToString();
        if (data.TryGetValue("summary", out var summary))
            resume.Summary = summary?.ToString();
        if (data.TryGetValue("title", out var title))
            resume.Title = title?.ToString();

        if (data.TryGetValue("skills", out var skills) && skills is JsonElement skillsElement)
            resume.Skills = skillsElement.EnumerateArray().Select(s => s.GetString() ?? "").ToList();

        if (data.TryGetValue("certifications", out var certs) && certs is JsonElement certsElement)
            resume.Certifications = certsElement.EnumerateArray().Select(c => c.GetString() ?? "").ToList();

        if (data.TryGetValue("languages", out var langs) && langs is JsonElement langsElement)
            resume.Languages = langsElement.EnumerateArray().Select(l => l.GetString() ?? "").ToList();

        if (data.TryGetValue("experience", out var exp) && exp is JsonElement expElement)
        {
            foreach (var expItem in expElement.EnumerateArray())
            {
                var experience = new Experience
                {
                    Company = expItem.GetProperty("company").GetString() ?? "",
                    Position = expItem.GetProperty("position").GetString() ?? "",
                    Location = expItem.TryGetProperty("location", out var loc) ? loc.GetString() : null,
                    StartDate = expItem.GetProperty("startDate").GetString() ?? "",
                    EndDate = expItem.TryGetProperty("endDate", out var end) ? end.GetString() : null,
                };

                if (expItem.TryGetProperty("description", out var desc) && desc.ValueKind == JsonValueKind.Array)
                {
                    experience.Description = desc.EnumerateArray().Select(d => d.GetString() ?? "").ToList();
                }

                resume.Experiences.Add(experience);
            }
        }

        if (data.TryGetValue("education", out var edu) && edu is JsonElement eduElement)
        {
            foreach (var eduItem in eduElement.EnumerateArray())
            {
                var education = new Education
                {
                    Institution = eduItem.GetProperty("institution").GetString() ?? "",
                    Degree = eduItem.GetProperty("degree").GetString() ?? "",
                    Field = eduItem.TryGetProperty("field", out var field) ? field.GetString() : null,
                    Location = eduItem.TryGetProperty("location", out var loc) ? loc.GetString() : null,
                    StartDate = eduItem.TryGetProperty("startDate", out var start) ? start.GetString() : null,
                    EndDate = eduItem.TryGetProperty("endDate", out var end) ? end.GetString() : null
                };

                resume.Educations.Add(education);
            }
        }

        if (data.TryGetValue("projects", out var proj) && proj is JsonElement projElement)
        {
            foreach (var projItem in projElement.EnumerateArray())
            {
                var project = new Project
                {
                    Name = projItem.GetProperty("name").GetString() ?? "",
                    Description = projItem.TryGetProperty("description", out var desc) ? desc.GetString() : null,
                    Url = projItem.TryGetProperty("url", out var url) ? url.GetString() : null
                };

                if (projItem.TryGetProperty("technologies", out var tech) && tech.ValueKind == JsonValueKind.Array)
                {
                    project.Technologies = tech.EnumerateArray().Select(t => t.GetString() ?? "").ToList();
                }

                resume.Projects.Add(project);
            }
        }

        return resume;
    }
}

