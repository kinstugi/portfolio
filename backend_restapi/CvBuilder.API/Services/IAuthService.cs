using CvBuilder.API.DTOs;

namespace CvBuilder.API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    string GenerateJwtToken(Guid userId, string email);
    Task<string> GetGoogleLoginUrlAsync();
    Task<AuthResponse> HandleGoogleCallbackAsync(string code);
}

