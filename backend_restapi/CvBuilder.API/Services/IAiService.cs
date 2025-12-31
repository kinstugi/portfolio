using CvBuilder.API.Models;

namespace CvBuilder.API.Services;

public interface IAiService
{
    Task<Resume> ExtractCvDataFromFileAsync(string filePath, string fileContent);
    Task<Resume> ExtractCvDataWithGeminiAsync(string filePath, string fileContent);
    Task<(string JobTitle, string? CompanyName)> ExtractJobDetailsAsync(string jobDescription);
    Task<(Resume TailoredCv, string CoverLetter)> TailorCvAsync(Resume originalCv, string jobDescription, string? imageUrl = null);
}

