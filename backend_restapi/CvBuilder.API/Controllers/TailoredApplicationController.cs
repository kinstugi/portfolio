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
    private readonly IPdfService _pdfService;
    private readonly ILogger<TailoredApplicationController> _logger;

    public TailoredApplicationController(
        ApplicationDbContext context,
        IAiService aiService,
        IPdfService pdfService,
        ILogger<TailoredApplicationController> logger)
    {
        _context = context;
        _aiService = aiService;
        _pdfService = pdfService;
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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TailorApplicationResponse>>> GetAllTailoredApplications()
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Fetching all tailored applications for user {userId}");

            // Get all tailored applications for the user, ordered by most recent first
            var tailoredApplications = await _context.TailoredApplications
                .Where(ta => ta.UserId == userId)
                .OrderByDescending(ta => ta.CreatedAt)
                .ToListAsync();

            // Map to response DTOs
            var responses = tailoredApplications.Select(ta =>
            {
                var tailoredCvObject = JsonSerializer.Deserialize<object>(ta.TailoredCvJson);

                return new TailorApplicationResponse
                {
                    Id = ta.Id,
                    JobTitle = ta.JobTitle,
                    CompanyName = ta.CompanyName,
                    TailoredCv = tailoredCvObject ?? new { },
                    CoverLetter = ta.CoverLetter,
                    CreatedAt = ta.CreatedAt,
                    UpdatedAt = ta.UpdatedAt
                };
            }).ToList();

            return Ok(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tailored applications");
            return StatusCode(500, new { message = $"An error occurred while fetching tailored applications: {ex.Message}" });
        }
    }

    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetTailoredApplicationPdf(Guid id, [FromQuery] int templateNumber = 3)
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Generating PDF for tailored application {id} for user {userId} using template {templateNumber}");

            // Get the tailored application
            var tailoredApplication = await _context.TailoredApplications
                .Where(ta => ta.Id == id && ta.UserId == userId)
                .FirstOrDefaultAsync();

            if (tailoredApplication == null)
            {
                return NotFound(new { message = "Tailored application not found." });
            }

            // Validate template number
            if (templateNumber < 1 || templateNumber > 4)
            {
                return BadRequest(new { message = "Template number must be between 1 and 4." });
            }

            // Generate PDF using the PDF service
            var pdfBytes = await _pdfService.GenerateTailoredApplicationPdfAsync(tailoredApplication, templateNumber);

            // Return PDF file with appropriate filename
            var fileName = $"{tailoredApplication.JobTitle.Replace(" ", "_")}_Tailored_CV.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating tailored application PDF");
            return StatusCode(500, new { message = $"An error occurred while generating the PDF: {ex.Message}" });
        }
    }
}

