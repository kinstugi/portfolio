using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace CvBuilder.API.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileService> _logger;
    private readonly string[] _allowedExtensions = { ".pdf", ".doc", ".docx", ".txt" };
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public FileService(IWebHostEnvironment environment, ILogger<FileService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null");

        if (!IsValidFileType(file.FileName))
            throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}");

        if (file.Length > MaxFileSize)
            throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSize / (1024 * 1024)}MB");

        // Create folder if it doesn't exist
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", folderName);
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Generate unique filename
        var fileExtension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return filePath;
    }

    public async Task<string> ExtractTextFromFileAsync(string filePath, string fileType)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"File not found: {filePath}");

        return fileType.ToLower() switch
        {
            ".txt" => await File.ReadAllTextAsync(filePath, Encoding.UTF8),
            ".pdf" => await ExtractTextFromPdfAsync(filePath),
            ".docx" => await ExtractTextFromDocxAsync(filePath),
            ".doc" => throw new NotSupportedException("DOC files are not supported. Please convert to DOCX or PDF format."),
            _ => throw new ArgumentException($"Unsupported file type: {fileType}")
        };
    }

    private Task<string> ExtractTextFromPdfAsync(string filePath)
    {
        try
        {
            var text = new StringBuilder();
            using (var pdfReader = new PdfReader(filePath))
            using (var pdfDocument = new PdfDocument(pdfReader))
            {
                var numberOfPages = pdfDocument.GetNumberOfPages();
                
                for (int page = 1; page <= numberOfPages; page++)
                {
                    var strategy = new SimpleTextExtractionStrategy();
                    var pageText = PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page), strategy);
                    text.AppendLine(pageText);
                }
            }

            var extractedText = text.ToString().Trim();
            if (string.IsNullOrWhiteSpace(extractedText))
            {
                throw new InvalidOperationException("Could not extract text from PDF. The PDF might be image-based or corrupted.");
            }

            return Task.FromResult(extractedText);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error extracting text from PDF: {filePath}");
            throw new InvalidOperationException($"Failed to extract text from PDF: {ex.Message}", ex);
        }
    }

    private Task<string> ExtractTextFromDocxAsync(string filePath)
    {
        try
        {
            var text = new StringBuilder();
            using (var wordDocument = WordprocessingDocument.Open(filePath, false))
            {
                var body = wordDocument.MainDocumentPart?.Document?.Body;
                if (body == null)
                {
                    throw new InvalidOperationException("Could not read DOCX file content.");
                }

                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    var paragraphText = paragraph.InnerText;
                    if (!string.IsNullOrWhiteSpace(paragraphText))
                    {
                        text.AppendLine(paragraphText);
                    }
                }
            }

            var extractedText = text.ToString().Trim();
            if (string.IsNullOrWhiteSpace(extractedText))
            {
                throw new InvalidOperationException("Could not extract text from DOCX file. The file might be empty or corrupted.");
            }

            return Task.FromResult(extractedText);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error extracting text from DOCX: {filePath}");
            throw new InvalidOperationException($"Failed to extract text from DOCX: {ex.Message}", ex);
        }
    }
    
    public async Task<byte[]> ReadFileBytesAsync(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"File not found: {filePath}");
        
        return await File.ReadAllBytesAsync(filePath);
    }

    public bool IsValidFileType(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return false;

        var extension = Path.GetExtension(fileName).ToLower();
        return _allowedExtensions.Contains(extension);
    }

    public long GetMaxFileSize()
    {
        return MaxFileSize;
    }
}


