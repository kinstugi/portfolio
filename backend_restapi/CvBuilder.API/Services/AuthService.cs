using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CvBuilder.API.Data;
using CvBuilder.API.DTOs;
using CvBuilder.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CvBuilder.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ApplicationDbContext context, 
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create new user
        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = passwordHash,
            Provider = "local",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user.Id, user.Email);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserId = user.Id
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Find user by email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Check if user is OAuth user (Provider is null for legacy users, which is fine for password login)
        if (user.Provider == "google" || string.IsNullOrEmpty(user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Please sign in with your social account.");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Update last login time
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user.Id, user.Email);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserId = user.Id
        };
    }

    public string GenerateJwtToken(Guid userId, string email)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured.");
        var issuer = jwtSettings["Issuer"] ?? "CvBuilder";
        var audience = jwtSettings["Audience"] ?? "CvBuilder";
        var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "1440"); // Default 24 hours

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GetGoogleLoginUrlAsync()
    {
        var clientId = _configuration["GoogleOAuth:ClientId"] 
            ?? throw new InvalidOperationException("GoogleOAuth:ClientId not configured");
        var redirectUri = _configuration["GoogleOAuth:RedirectUri"] 
            ?? throw new InvalidOperationException("GoogleOAuth:RedirectUri not configured");
        
        var state = Guid.NewGuid().ToString(); // For CSRF protection - in production, store in cache/session
        
        var url = "https://accounts.google.com/o/oauth2/v2/auth?" +
                  $"client_id={Uri.EscapeDataString(clientId)}&" +
                  $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                  "response_type=code&" +
                  "scope=openid email profile&" +
                  $"state={Uri.EscapeDataString(state)}&" +
                  "access_type=offline&" +
                  "prompt=consent";
        
        return url;
    }

    public async Task<AuthResponse> HandleGoogleCallbackAsync(string code)
    {
        var clientId = _configuration["GoogleOAuth:ClientId"] 
            ?? throw new InvalidOperationException("GoogleOAuth:ClientId not configured");
        var clientSecret = _configuration["GoogleOAuth:ClientSecret"] 
            ?? throw new InvalidOperationException("GoogleOAuth:ClientSecret not configured");
        var redirectUri = _configuration["GoogleOAuth:RedirectUri"] 
            ?? throw new InvalidOperationException("GoogleOAuth:RedirectUri not configured");

        var httpClient = _httpClientFactory.CreateClient();

        // Exchange authorization code for access token
        var tokenRequest = new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "redirect_uri", redirectUri },
            { "grant_type", "authorization_code" }
        };

        var tokenContent = new FormUrlEncodedContent(tokenRequest);
        var tokenResponse = await httpClient.PostAsync("https://oauth2.googleapis.com/token", tokenContent);
        var tokenResponseContent = await tokenResponse.Content.ReadAsStringAsync();

        if (!tokenResponse.IsSuccessStatusCode)
        {
            _logger.LogError($"Google token exchange failed: {tokenResponseContent}");
            throw new InvalidOperationException("Failed to exchange authorization code for token.");
        }

        var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenResponseContent);
        var accessToken = tokenData.GetProperty("access_token").GetString() 
            ?? throw new InvalidOperationException("Failed to get access token from Google.");

        // Get user info from Google
        httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        var userInfoResponse = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        var userInfoContent = await userInfoResponse.Content.ReadAsStringAsync();

        if (!userInfoResponse.IsSuccessStatusCode)
        {
            _logger.LogError($"Google user info request failed: {userInfoContent}");
            throw new InvalidOperationException("Failed to get user information from Google.");
        }

        var userInfo = JsonSerializer.Deserialize<JsonElement>(userInfoContent);
        var googleId = userInfo.GetProperty("id").GetString() 
            ?? throw new InvalidOperationException("Failed to get Google user ID.");
        var email = userInfo.GetProperty("email").GetString() 
            ?? throw new InvalidOperationException("Failed to get email from Google.");
        var firstName = userInfo.TryGetProperty("given_name", out var givenName) 
            ? givenName.GetString() ?? "User" 
            : "User";
        var lastName = userInfo.TryGetProperty("family_name", out var familyName) 
            ? familyName.GetString() ?? "" 
            : "";

        // Find or create user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.GoogleId == googleId || u.Email == email);

        if (user == null)
        {
            // Create new user
            user = new User
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                GoogleId = googleId,
                Provider = "google",
                IsEmailVerified = true, // Google emails are verified
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created new Google user: {email}");
        }
        else
        {
            // Update existing user if needed
            if (user.GoogleId != googleId)
            {
                user.GoogleId = googleId;
                user.Provider = "google";
            }
            
            user.FirstName = firstName;
            user.LastName = lastName;
            user.IsEmailVerified = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Updated Google user: {email}");
        }

        // Generate JWT token
        var token = GenerateJwtToken(user.Id, user.Email);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserId = user.Id
        };
    }
}

