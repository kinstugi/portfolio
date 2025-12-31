namespace CvBuilder.API.Services;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folderName);
    Task<string> ExtractTextFromFileAsync(string filePath, string fileType);
    Task<byte[]> ReadFileBytesAsync(string filePath);
    bool IsValidFileType(string fileName);
    long GetMaxFileSize();
}

