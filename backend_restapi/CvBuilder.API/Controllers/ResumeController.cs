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
public class ResumeController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFileService _fileService;
    private readonly IAiService _aiService;
    private readonly ILogger<ResumeController> _logger;

    public ResumeController(
        ApplicationDbContext context,
        IFileService fileService,
        IAiService aiService,
        ILogger<ResumeController> logger)
    {
        _context = context;
        _fileService = fileService;
        _aiService = aiService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<UploadResumeResponse>> UploadResume([FromForm] UploadResumeRequest request)
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            // Validate file type (only PDF or DOCX)
            var fileExtension = Path.GetExtension(request.CvFile.FileName).ToLower();
            if (fileExtension != ".pdf" && fileExtension != ".docx")
            {
                return BadRequest(new { message = "Only PDF and DOCX files are allowed." });
            }

            // Validate file
            if (!_fileService.IsValidFileType(request.CvFile.FileName))
            {
                return BadRequest(new { message = "Invalid file type. Only PDF and DOCX files are allowed." });
            }

            _logger.LogInformation($"Processing CV upload for user {userId}: {request.CvFile.FileName}");

            // Save CV file
            var cvFilePath = await _fileService.SaveFileAsync(request.CvFile, "cvs");
            var cvFileType = Path.GetExtension(request.CvFile.FileName);

            // Extract text content from CV file
            string cvContent;
            try
            {
                cvContent = await _fileService.ExtractTextFromFileAsync(cvFilePath, cvFileType);
                
                if (string.IsNullOrWhiteSpace(cvContent))
                {
                    return BadRequest(new { 
                        message = "Could not extract text from CV file. The file might be empty or corrupted." 
                    });
                }
            }
            catch (NotSupportedException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting text from CV file");
                return BadRequest(new { 
                    message = $"Error processing CV file: {ex.Message}" 
                });
            }

            // Extract CV data using Groq AI (preferred, falls back to Gemini)
            Resume cvData;
            try
            {
                cvData = await _aiService.ExtractCvDataFromFileAsync(cvFilePath, cvContent);
                _logger.LogInformation("CV data extracted successfully using AI");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting CV data from file");
                return BadRequest(new { message = $"Error extracting CV data: {ex.Message}" });
            }

            // Set user and metadata
            cvData.UserId = userId;
            cvData.CreatedAt = DateTime.UtcNow;
            cvData.UpdatedAt = DateTime.UtcNow;
            cvData.IsDefault = true; // Mark as default resume

            // Clear navigation properties before saving
            var experiences = cvData.Experiences.ToList();
            var educations = cvData.Educations.ToList();
            var projects = cvData.Projects.ToList();
            cvData.Experiences.Clear();
            cvData.Educations.Clear();
            cvData.Projects.Clear();

            // Save extracted CV to database
            _context.Resumes.Add(cvData);
            await _context.SaveChangesAsync();

            // Save related entities
            foreach (var exp in experiences)
            {
                exp.ResumeId = cvData.Id;
                _context.Experiences.Add(exp);
            }

            foreach (var edu in educations)
            {
                edu.ResumeId = cvData.Id;
                _context.Educations.Add(edu);
            }

            foreach (var proj in projects)
            {
                proj.ResumeId = cvData.Id;
                _context.Projects.Add(proj);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Resume saved successfully with ID: {cvData.Id}");

            // Return response
            var response = new UploadResumeResponse
            {
                Id = cvData.Id,
                Name = cvData.Name,
                Email = cvData.Email,
                Phone = cvData.Phone,
                CreatedAt = cvData.CreatedAt,
                UpdatedAt = cvData.UpdatedAt
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading resume");
            return StatusCode(500, new { message = $"An error occurred while uploading the resume: {ex.Message}" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResumeListItemResponse>>> GetAllResumes()
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Fetching all resumes for user {userId}");

            // Get all resumes for the user, ordered by most recent first
            var resumes = await _context.Resumes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.UpdatedAt)
                .Select(r => new ResumeListItemResponse
                {
                    Id = r.Id,
                    Name = r.Name,
                    Title = r.Title,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return Ok(resumes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching resumes");
            return StatusCode(500, new { message = $"An error occurred while fetching resumes: {ex.Message}" });
        }
    }

    [HttpGet("last")]
    public async Task<ActionResult<ResumeResponse>> GetLastResume()
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Fetching last resume for user {userId}");

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
                return NotFound(new { message = "No resume found. Please upload your CV first." });
            }

            // Map to response DTO
            var response = new ResumeResponse
            {
                Id = resume.Id,
                Name = resume.Name,
                Location = resume.Location,
                Email = resume.Email,
                Phone = resume.Phone,
                GitHub = resume.GitHub,
                LinkedIn = resume.LinkedIn,
                Portfolio = resume.Portfolio,
                Image = resume.Image,
                Summary = resume.Summary,
                Skills = resume.Skills,
                Certifications = resume.Certifications,
                Languages = resume.Languages,
                IsDefault = resume.IsDefault,
                Title = resume.Title,
                CreatedAt = resume.CreatedAt,
                UpdatedAt = resume.UpdatedAt,
                Experiences = resume.Experiences.Select(e => new ExperienceDto
                {
                    Id = e.Id,
                    Company = e.Company,
                    Position = e.Position,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrentPosition = e.IsCurrentPosition,
                    Description = e.Description
                }).ToList(),
                Educations = resume.Educations.Select(e => new EducationDto
                {
                    Id = e.Id,
                    Institution = e.Institution,
                    Degree = e.Degree,
                    Field = e.Field,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                }).ToList(),
                Projects = resume.Projects.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Technologies = p.Technologies,
                    Url = p.Url
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching last resume");
            return StatusCode(500, new { message = $"An error occurred while fetching the resume: {ex.Message}" });
        }
    }

    [HttpPut("last")]
    public async Task<ActionResult<ResumeResponse>> UpdateLastResume([FromBody] UpdateResumeRequest request)
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Updating last resume for user {userId}");

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
                return NotFound(new { message = "No resume found. Please upload your CV first." });
            }

            // Update basic fields (only if provided)
            if (request.Name != null) resume.Name = request.Name;
            if (request.Location != null) resume.Location = request.Location;
            if (request.Email != null) resume.Email = request.Email;
            if (request.Phone != null) resume.Phone = request.Phone;
            if (request.GitHub != null) resume.GitHub = request.GitHub;
            if (request.LinkedIn != null) resume.LinkedIn = request.LinkedIn;
            if (request.Portfolio != null) resume.Portfolio = request.Portfolio;
            if (request.Image != null) resume.Image = request.Image;
            if (request.Summary != null) resume.Summary = request.Summary;
            if (request.Title != null) resume.Title = request.Title;
            
            // Update lists (only if provided)
            if (request.Skills != null) resume.Skills = request.Skills;
            if (request.Certifications != null) resume.Certifications = request.Certifications;
            if (request.Languages != null) resume.Languages = request.Languages;

            resume.UpdatedAt = DateTime.UtcNow;

            // Update Experiences (replace all if provided)
            if (request.Experiences != null)
            {
                // Remove existing experiences
                _context.Experiences.RemoveRange(resume.Experiences);
                resume.Experiences.Clear();

                // Add new experiences
                foreach (var expDto in request.Experiences)
                {
                    var experience = new Experience
                    {
                        Id = expDto.Id != Guid.Empty ? expDto.Id : Guid.NewGuid(),
                        ResumeId = resume.Id,
                        Company = expDto.Company,
                        Position = expDto.Position,
                        Location = expDto.Location,
                        StartDate = expDto.StartDate,
                        EndDate = expDto.EndDate,
                        IsCurrentPosition = expDto.IsCurrentPosition,
                        Description = expDto.Description
                    };
                    resume.Experiences.Add(experience);
                }
            }

            // Update Educations (replace all if provided)
            if (request.Educations != null)
            {
                // Remove existing educations
                _context.Educations.RemoveRange(resume.Educations);
                resume.Educations.Clear();

                // Add new educations
                foreach (var eduDto in request.Educations)
                {
                    var education = new Education
                    {
                        Id = eduDto.Id != Guid.Empty ? eduDto.Id : Guid.NewGuid(),
                        ResumeId = resume.Id,
                        Institution = eduDto.Institution,
                        Degree = eduDto.Degree,
                        Field = eduDto.Field,
                        Location = eduDto.Location,
                        StartDate = eduDto.StartDate,
                        EndDate = eduDto.EndDate
                    };
                    resume.Educations.Add(education);
                }
            }

            // Update Projects (replace all if provided)
            if (request.Projects != null)
            {
                // Remove existing projects
                _context.Projects.RemoveRange(resume.Projects);
                resume.Projects.Clear();

                // Add new projects
                foreach (var projDto in request.Projects)
                {
                    var project = new Project
                    {
                        Id = projDto.Id != Guid.Empty ? projDto.Id : Guid.NewGuid(),
                        ResumeId = resume.Id,
                        Name = projDto.Name,
                        Description = projDto.Description,
                        Technologies = projDto.Technologies,
                        Url = projDto.Url
                    };
                    resume.Projects.Add(project);
                }
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Resume updated successfully with ID: {resume.Id}");

            // Reload with all related data
            resume = await _context.Resumes
                .Include(r => r.Experiences)
                .Include(r => r.Educations)
                .Include(r => r.Projects)
                .FirstAsync(r => r.Id == resume.Id);

            // Map to response DTO
            var response = new ResumeResponse
            {
                Id = resume.Id,
                Name = resume.Name,
                Location = resume.Location,
                Email = resume.Email,
                Phone = resume.Phone,
                GitHub = resume.GitHub,
                LinkedIn = resume.LinkedIn,
                Portfolio = resume.Portfolio,
                Image = resume.Image,
                Summary = resume.Summary,
                Skills = resume.Skills,
                Certifications = resume.Certifications,
                Languages = resume.Languages,
                IsDefault = resume.IsDefault,
                Title = resume.Title,
                CreatedAt = resume.CreatedAt,
                UpdatedAt = resume.UpdatedAt,
                Experiences = resume.Experiences.Select(e => new ExperienceDto
                {
                    Id = e.Id,
                    Company = e.Company,
                    Position = e.Position,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrentPosition = e.IsCurrentPosition,
                    Description = e.Description
                }).ToList(),
                Educations = resume.Educations.Select(e => new EducationDto
                {
                    Id = e.Id,
                    Institution = e.Institution,
                    Degree = e.Degree,
                    Field = e.Field,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                }).ToList(),
                Projects = resume.Projects.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Technologies = p.Technologies,
                    Url = p.Url
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating resume");
            return StatusCode(500, new { message = $"An error occurred while updating the resume: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteResume(Guid id)
    {
        try
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            _logger.LogInformation($"Deleting resume {id} for user {userId}");

            // Get the resume and verify it belongs to the user
            var resume = await _context.Resumes
                .Where(r => r.Id == id && r.UserId == userId)
                .FirstOrDefaultAsync();

            if (resume == null)
            {
                return NotFound(new { message = "Resume not found or you don't have permission to delete it." });
            }

            // Delete the resume (cascade delete will handle related entities)
            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Resume {id} deleted successfully");

            return Ok(new { message = "Resume deleted successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting resume");
            return StatusCode(500, new { message = $"An error occurred while deleting the resume: {ex.Message}" });
        }
    }
}

