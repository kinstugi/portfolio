using System.Text.Json;
using CvBuilder.API.Data;
using CvBuilder.API.DTOs;
using CvBuilder.API.Models;
using CvBuilder.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CvBuilder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TailoredApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAiService _aiService;
    private readonly ILogger<TailoredApplicationController> _logger;

    public TailoredApplicationController(
        ApplicationDbContext context,
        IAiService aiService,
        ILogger<TailoredApplicationController> logger)
    {
        _context = context;
        _aiService = aiService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<TailorApplicationResponse>> TailorApplication([FromBody] TailorApplicationRequest request)
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            // Validate job description
            if (string.IsNullOrWhiteSpace(request.JobDescription))
            {
                return BadRequest(new { message = "Job description is required" });
            }

            _logger.LogInformation($"Processing job application tailoring for user {userId}");

            // Get user's most recent resume
            var resume = await _context.Resumes
                .Include(r => r.Experiences)
                .Include(r => r.Educations)
                .Include(r => r.Projects)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (resume == null)
            {
                return BadRequest(new { message = "No resume found. Please upload your CV first using the /api/resume/upload endpoint." });
            }

            // Extract Job Title and Company Name from job description using Gemini
            _logger.LogInformation("Extracting job title and company name from job description...");
            var (jobTitle, companyName) = await _aiService.ExtractJobDetailsAsync(request.JobDescription);

            // Tailor CV and generate cover letter using Gemini
            _logger.LogInformation("Tailoring CV to match job description and generating cover letter...");
            var (tailoredCv, coverLetter) = await _aiService.TailorCvAsync(
                resume,
                request.JobDescription,
                request.ImageUrl
            );

            // Convert tailored CV to JSON string
            var tailoredCvJson = JsonSerializer.Serialize(new
            {
                name = tailoredCv.Name,
                location = tailoredCv.Location,
                email = tailoredCv.Email,
                phone = tailoredCv.Phone,
                github = tailoredCv.GitHub,
                linkedin = tailoredCv.LinkedIn,
                portfolio = tailoredCv.Portfolio,
                image = tailoredCv.Image,
                summary = tailoredCv.Summary,
                skills = tailoredCv.Skills,
                certifications = tailoredCv.Certifications,
                languages = tailoredCv.Languages,
                experience = tailoredCv.Experiences.Select(e => new
                {
                    company = e.Company,
                    position = e.Position,
                    location = e.Location,
                    startDate = e.StartDate,
                    endDate = e.EndDate,
                    description = e.Description
                }),
                education = tailoredCv.Educations.Select(e => new
                {
                    institution = e.Institution,
                    degree = e.Degree,
                    field = e.Field,
                    location = e.Location,
                    startDate = e.StartDate,
                    endDate = e.EndDate
                }),
                projects = tailoredCv.Projects.Select(p => new
                {
                    name = p.Name,
                    description = p.Description,
                    technologies = p.Technologies,
                    url = p.Url
                })
            }, new JsonSerializerOptions { WriteIndented = true });

            // Save to TailoredApplication table
            var tailoredApplication = new TailoredApplication
            {
                JobTitle = jobTitle,
                CompanyName = companyName,
                JobDescription = request.JobDescription,
                TailoredCvJson = tailoredCvJson,
                CoverLetter = coverLetter,
                UserId = userId,
                BaseResumeId = resume.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TailoredApplications.Add(tailoredApplication);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Tailored application saved successfully with ID: {tailoredApplication.Id}");

            // Parse JSON back to object for response
            var tailoredCvObject = JsonSerializer.Deserialize<object>(tailoredCvJson);

            var response = new TailorApplicationResponse
            {
                Id = tailoredApplication.Id,
                JobTitle = tailoredApplication.JobTitle,
                CompanyName = tailoredApplication.CompanyName,
                TailoredCv = tailoredCvObject ?? new { },
                CoverLetter = tailoredApplication.CoverLetter,
                CreatedAt = tailoredApplication.CreatedAt,
                UpdatedAt = tailoredApplication.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing tailored application");
            return StatusCode(500, new { message = $"An error occurred while processing the tailored application: {ex.Message}" });
        }
    }
}

