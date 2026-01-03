using CvBuilder.API.DTOs;
using CvBuilder.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CvBuilder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, ILogger<AuthController> logger, IConfiguration configuration)
    {
        _authService = authService;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration." });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login." });
        }
    }

    [HttpGet("google")]
    public async Task<IActionResult> GoogleLogin()
    {
        try
        {
            var url = await _authService.GetGoogleLoginUrlAsync();
            return Redirect(url);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Google login URL");
            return StatusCode(500, new { message = "An error occurred while initiating Google login." });
        }
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string? state)
    {
        try
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest(new { message = "Authorization code is missing." });
            }

            var response = await _authService.HandleGoogleCallbackAsync(code);
            
            // Redirect to frontend with token
            // In production, use environment variable for frontend URL
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            return Redirect($"{frontendUrl}/auth/callback?token={response.Token}&email={Uri.EscapeDataString(response.Email)}&firstName={Uri.EscapeDataString(response.FirstName)}&lastName={Uri.EscapeDataString(response.LastName)}&userId={response.UserId}");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error handling Google callback");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling Google callback");
            return StatusCode(500, new { message = "An error occurred during Google authentication." });
        }
    }
}

