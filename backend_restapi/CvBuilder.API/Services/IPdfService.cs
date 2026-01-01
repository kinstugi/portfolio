using CvBuilder.API.Models;

namespace CvBuilder.API.Services;

public interface IPdfService
{
    Task<byte[]> GenerateResumePdfAsync(Resume resume, int templateNumber = 1);
    Task<byte[]> GenerateTailoredApplicationPdfAsync(TailoredApplication tailoredApplication, int templateNumber = 1);
}

