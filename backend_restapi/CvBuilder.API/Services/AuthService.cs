using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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
}

