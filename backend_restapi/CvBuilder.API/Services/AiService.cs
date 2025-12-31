using System.Text;
using System.Text.Json;
using CvBuilder.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CvBuilder.API.Services;

public class AiService : IAiService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AiService> _logger;

    public AiService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<AiService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<Resume> ExtractCvDataFromFileAsync(string filePath, string fileContent)
    {
        // If fileContent is a marker, read the actual file
        string actualContent = fileContent;
        if (fileContent.StartsWith("[FILE:") || fileContent.StartsWith("[PDF_FILE:") || 
            fileContent.StartsWith("[DOC_FILE:") || fileContent.StartsWith("[DOCX_FILE:"))
        {
            // For binary files, we'll pass the file path to AI
            // AI services can handle file uploads or we read as text if possible
            try
            {
                if (filePath.EndsWith(".txt", StringComparison.OrdinalIgnoreCase))
                {
                    actualContent = await File.ReadAllTextAsync(filePath, Encoding.UTF8);
                }
                else
                {
                    // For PDF/DOC/DOCX, we'll include file path in prompt for AI to process
                    actualContent = $"File path: {filePath}\n[Note: This is a binary file. Please extract text content from this file path.]";
                }
            }
            catch
            {
                actualContent = fileContent;
            }
        }

        var groqApiKey = _configuration["Groq:ApiKey"];
        var googleApiKey = _configuration["GoogleAI:ApiKey"];

        // Prefer Groq for CV extraction, fallback to Gemini
        if (!string.IsNullOrEmpty(groqApiKey))
        {
            return await ExtractCvWithGroqAsync(actualContent, groqApiKey);
        }
        else if (!string.IsNullOrEmpty(googleApiKey))
        {
            return await ExtractCvWithGeminiAsync(actualContent, googleApiKey);
        }
        else
        {
            throw new InvalidOperationException("AI API key not configured. Please set either Groq:ApiKey or GoogleAI:ApiKey in appsettings.json");
        }
    }

    public async Task<Resume> ExtractCvDataWithGeminiAsync(string filePath, string fileContent)
    {
        // Extract text content from file (PDF/DOCX)
        string actualContent = fileContent;
        if (fileContent.StartsWith("[FILE:") || fileContent.StartsWith("[PDF_FILE:") || 
            fileContent.StartsWith("[DOC_FILE:") || fileContent.StartsWith("[DOCX_FILE:"))
        {
            try
            {
                if (filePath.EndsWith(".txt", StringComparison.OrdinalIgnoreCase))
                {
                    actualContent = await File.ReadAllTextAsync(filePath, Encoding.UTF8);
                }
                else
                {
                    // For PDF/DOCX, we've already extracted text in FileService
                    actualContent = fileContent;
                }
            }
            catch
            {
                actualContent = fileContent;
            }
        }

        var googleApiKey = _configuration["GoogleAI:ApiKey"];
        if (string.IsNullOrEmpty(googleApiKey))
        {
            throw new InvalidOperationException("GoogleAI:ApiKey is not configured. Please set GoogleAI:ApiKey in appsettings.json");
        }

        // Use Gemini only for CV extraction
        return await ExtractCvWithGeminiAsync(actualContent, googleApiKey);
    }

    private async Task<Resume> ExtractCvWithGroqAsync(string cvContent, string apiKey)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        var prompt = $@"Extract all information from this CV/resume and return it as a JSON object. 
Use ONLY the information provided in the CV. Do NOT add placeholder values or make up information.

CV Content:
{cvContent}

Return a JSON object with this exact structure:
{{
    ""name"": ""Full Name from CV"",
    ""location"": ""City, Country"",
    ""email"": ""email@example.com"",
    ""phone"": ""phone number"",
    ""github"": ""https://github.com/username or empty string"",
    ""linkedin"": ""https://linkedin.com/in/username or empty string"",
    ""portfolio"": ""https://portfolio-url.com or empty string"",
    ""summary"": ""Professional summary"",
    ""skills"": [""skill1"", ""skill2""],
    ""experience"": [
        {{
            ""company"": ""Company Name"",
            ""position"": ""Job Title"",
            ""location"": ""City, Country"",
            ""startDate"": ""Month Year"",
            ""endDate"": ""Month Year or Present"",
            ""description"": [""Achievement 1"", ""Achievement 2""]
        }}
    ],
    ""education"": [
        {{
            ""institution"": ""University Name"",
            ""degree"": ""Degree Name"",
            ""field"": ""Field of Study"",
            ""location"": ""City, Country"",
            ""startDate"": ""Year"",
            ""endDate"": ""Year""
        }}
    ],
    ""certifications"": [""Certification 1"", ""Certification 2""],
    ""languages"": [""Language 1"", ""Language 2""],
    ""projects"": [
        {{
            ""name"": ""Project Name"",
            ""description"": ""Project description"",
            ""technologies"": [""tech1"", ""tech2""]
        }}
    ]
}}

Return ONLY the JSON object, no other text.";

        var model = _configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";
        
        var requestBody = new
        {
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.3
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        const int maxRetries = 3;
        
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                var url = "https://api.groq.com/openai/v1/chat/completions";
                _logger.LogInformation($"Calling Groq API at {url} with model {model} (attempt {attempt + 1}/{maxRetries})");
                
                var response = await client.PostAsync(url, content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt < maxRetries - 1)
                    {
                        _logger.LogWarning($"Groq API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                        continue;
                    }
                    else
                    {
                        _logger.LogError($"Groq API rate limited after {maxRetries} attempts");
                        throw new InvalidOperationException("Rate limit exceeded. Please wait a moment and try again.");
                    }
                }
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Groq API error: Status {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Groq API returned status {response.StatusCode}: {responseContent}");
                }

            var responseJson = JsonDocument.Parse(responseContent);
            
            if (!responseJson.RootElement.TryGetProperty("choices", out var choices) || 
                choices.GetArrayLength() == 0)
            {
                _logger.LogError($"Groq API response missing choices: {responseContent}");
                throw new InvalidOperationException("Groq API response missing choices array");
            }
            
            var extractedText = choices[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                _logger.LogError($"Groq API returned empty content: {responseContent}");
                throw new InvalidOperationException("Groq API returned empty content");
            }

            // Clean up JSON if wrapped in markdown
            extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```json\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
            extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
            extractedText = extractedText.Trim();

            var cvData = JsonSerializer.Deserialize<Dictionary<string, object>>(extractedText);
            if (cvData == null)
            {
                _logger.LogError($"Failed to deserialize Groq response: {extractedText}");
                throw new InvalidOperationException("Failed to deserialize CV data from Groq response");
            }
            
                return MapToResume(cvData);
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("429") && attempt < maxRetries - 1)
            {
                _logger.LogWarning($"Groq API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                continue;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error extracting CV with Groq");
                throw;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "JSON parsing error extracting CV with Groq");
                throw new InvalidOperationException($"Failed to parse Groq API response: {ex.Message}", ex);
            }
        }
        
        throw new InvalidOperationException("Failed to extract CV data after multiple retry attempts.");
    }

    private async Task<Resume> ExtractCvWithGeminiAsync(string cvContent, string apiKey)
    {
        var client = _httpClientFactory.CreateClient();

        var prompt = $@"Extract all information from this CV/resume and return it as a JSON object. 
Use ONLY the information provided in the CV. Do NOT add placeholder values or make up information.

CV Content:
{cvContent}

Return a JSON object with this exact structure:
{{
    ""name"": ""Full Name from CV"",
    ""location"": ""City, Country"",
    ""email"": ""email@example.com"",
    ""phone"": ""phone number"",
    ""github"": ""https://github.com/username or empty string"",
    ""linkedin"": ""https://linkedin.com/in/username or empty string"",
    ""portfolio"": ""https://portfolio-url.com or empty string"",
    ""summary"": ""Professional summary"",
    ""skills"": [""skill1"", ""skill2""],
    ""experience"": [
        {{
            ""company"": ""Company Name"",
            ""position"": ""Job Title"",
            ""location"": ""City, Country"",
            ""startDate"": ""Month Year"",
            ""endDate"": ""Month Year or Present"",
            ""description"": [""Achievement 1"", ""Achievement 2""]
        }}
    ],
    ""education"": [
        {{
            ""institution"": ""University Name"",
            ""degree"": ""Degree Name"",
            ""field"": ""Field of Study"",
            ""location"": ""City, Country"",
            ""startDate"": ""Year"",
            ""endDate"": ""Year""
        }}
    ],
    ""certifications"": [""Certification 1"", ""Certification 2""],
    ""languages"": [""Language 1"", ""Language 2""],
    ""projects"": [
        {{
            ""name"": ""Project Name"",
            ""description"": ""Project description"",
            ""technologies"": [""tech1"", ""tech2""]
        }}
    ]
}}

Return ONLY the JSON object, no other text.";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        const int maxRetries = 3;
        
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                var model = _configuration["GoogleAI:Model"] ?? "gemini-2.0-flash-exp";
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";
                
                _logger.LogInformation($"Calling Gemini API (attempt {attempt + 1}/{maxRetries})");
                
                var response = await client.PostAsync(url, content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt < maxRetries - 1)
                    {
                        _logger.LogWarning($"Gemini API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                        continue;
                    }
                    else
                    {
                        _logger.LogError($"Gemini API rate limited after {maxRetries} attempts");
                        throw new InvalidOperationException("Rate limit exceeded. Please wait a moment and try again.");
                    }
                }
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Gemini API error: Status {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Gemini API returned status {response.StatusCode}: {responseContent}");
                }

                var responseJson = JsonDocument.Parse(responseContent);
                
                if (!responseJson.RootElement.TryGetProperty("candidates", out var candidates) || 
                    candidates.GetArrayLength() == 0)
                {
                    _logger.LogError($"Gemini API response missing candidates: {responseContent}");
                    throw new InvalidOperationException("Gemini API response missing candidates array");
                }
                
                var extractedText = candidates[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "";

                if (string.IsNullOrWhiteSpace(extractedText))
                {
                    _logger.LogError($"Gemini API returned empty content: {responseContent}");
                    throw new InvalidOperationException("Gemini API returned empty content");
                }

                // Clean up JSON if wrapped in markdown
                extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```json\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                extractedText = extractedText.Trim();

                var cvData = JsonSerializer.Deserialize<Dictionary<string, object>>(extractedText);
                if (cvData == null)
                {
                    _logger.LogError($"Failed to deserialize Gemini response: {extractedText}");
                    throw new InvalidOperationException("Failed to deserialize CV data from Gemini response");
                }
                
                return MapToResume(cvData);
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("429") && attempt < maxRetries - 1)
            {
                _logger.LogWarning($"Gemini API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                continue;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error extracting CV with Gemini");
                throw;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "JSON parsing error extracting CV with Gemini");
                throw new InvalidOperationException($"Failed to parse Gemini API response: {ex.Message}", ex);
            }
        }
        
        throw new InvalidOperationException("Failed to extract CV data after multiple retry attempts.");
    }

    public async Task<(string JobTitle, string? CompanyName)> ExtractJobDetailsAsync(string jobDescription)
    {
        var apiKey = _configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI:ApiKey not configured");
        var baseUrl = _configuration["OpenAI:BaseUrl"] ?? throw new InvalidOperationException("OpenAI:BaseUrl not configured");
        var deployment = _configuration["OpenAI:Deployment"] ?? _configuration["OpenAI:Model"] ?? "gpt-4o";
        var apiVersion = _configuration["OpenAI:ApiVersion"] ?? "2024-08-01-preview";

        var prompt = $@"Extract the job title and company name from the following job description. 
Return ONLY a JSON object with this exact structure:
{{
    ""jobTitle"": ""exact job title from the description"",
    ""companyName"": ""company name if mentioned, or null if not found""
}}

Job Description:
{jobDescription}

Return ONLY the JSON object, no other text.";

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Add("api-key", apiKey);

        var requestBody = new
        {
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.3
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        const int maxRetries = 3;
        
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                var url = $"{baseUrl}deployments/{deployment}/chat/completions?api-version={apiVersion}";
                
                _logger.LogInformation($"Calling Azure OpenAI (GPT-4o) API for job details (attempt {attempt + 1}/{maxRetries})");
                
                var response = await client.PostAsync(url, content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt < maxRetries - 1)
                    {
                        _logger.LogWarning($"Azure OpenAI API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                        continue;
                    }
                    else
                    {
                        _logger.LogError($"Azure OpenAI API rate limited after {maxRetries} attempts");
                        throw new InvalidOperationException("Rate limit exceeded. Please wait a moment and try again.");
                    }
                }
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Azure OpenAI API error: Status {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Azure OpenAI API returned status {response.StatusCode}: {responseContent}");
                }

                var responseJson = JsonDocument.Parse(responseContent);
                
                if (!responseJson.RootElement.TryGetProperty("choices", out var choices) || 
                    choices.GetArrayLength() == 0)
                {
                    _logger.LogError($"Azure OpenAI API response missing choices: {responseContent}");
                    throw new InvalidOperationException("Azure OpenAI API response missing choices array");
                }
                
                var extractedText = choices[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? "";

                if (string.IsNullOrWhiteSpace(extractedText))
                {
                    _logger.LogError($"Azure OpenAI returned empty content: {responseContent}");
                    throw new InvalidOperationException("Azure OpenAI returned empty content");
                }

                // Clean up JSON if wrapped in markdown
                extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```json\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                extractedText = System.Text.RegularExpressions.Regex.Replace(extractedText, @"^```\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                extractedText = extractedText.Trim();

                var jobData = JsonSerializer.Deserialize<Dictionary<string, object>>(extractedText);
                
                if (jobData == null)
                {
                    _logger.LogError($"Failed to deserialize Azure OpenAI response: {extractedText}");
                    throw new InvalidOperationException("Failed to deserialize job details from Azure OpenAI response");
                }
                
                var jobTitle = jobData.TryGetValue("jobTitle", out var title) ? title?.ToString() ?? "" : "";
                var companyName = jobData.TryGetValue("companyName", out var company) ? company?.ToString() : null;

                return (jobTitle, companyName);
            }
            catch (HttpRequestException ex) when (ex.Message.Contains("429") && attempt < maxRetries - 1)
            {
                _logger.LogWarning($"Azure OpenAI API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                continue;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error extracting job details");
                if (attempt == maxRetries - 1)
                {
                    throw;
                }
                continue;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "JSON parsing error extracting job details");
                if (attempt == maxRetries - 1)
                {
                    throw new InvalidOperationException($"Failed to parse Azure OpenAI API response: {ex.Message}", ex);
                }
                continue;
            }
        }
        
        throw new InvalidOperationException("Failed to extract job details after multiple retry attempts.");
    }

    public async Task<(Resume TailoredCv, string CoverLetter)> TailorCvAsync(Resume originalCv, string jobDescription, string? imageUrl = null)
    {
        var apiKey = _configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI:ApiKey not configured");
        var baseUrl = _configuration["OpenAI:BaseUrl"] ?? throw new InvalidOperationException("OpenAI:BaseUrl not configured");
        var deployment = _configuration["OpenAI:Deployment"] ?? _configuration["OpenAI:Model"] ?? "gpt-4o";
        var apiVersion = _configuration["OpenAI:ApiVersion"] ?? "2024-08-01-preview";

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Add("api-key", apiKey);

        // Convert Resume to JSON for the prompt
        var cvJson = JsonSerializer.Serialize(new
        {
            name = originalCv.Name,
            location = originalCv.Location,
            email = originalCv.Email,
            phone = originalCv.Phone,
            github = originalCv.GitHub,
            linkedin = originalCv.LinkedIn,
            portfolio = originalCv.Portfolio,
            image = imageUrl ?? originalCv.Image ?? "",
            summary = originalCv.Summary,
            skills = originalCv.Skills,
            experience = originalCv.Experiences.Select(e => new
            {
                company = e.Company,
                position = e.Position,
                location = e.Location,
                startDate = e.StartDate,
                endDate = e.EndDate,
                description = e.Description
            }),
            education = originalCv.Educations.Select(e => new
            {
                institution = e.Institution,
                degree = e.Degree,
                field = e.Field,
                location = e.Location,
                startDate = e.StartDate,
                endDate = e.EndDate
            }),
            certifications = originalCv.Certifications,
            languages = originalCv.Languages,
            projects = originalCv.Projects.Select(p => new
            {
                name = p.Name,
                description = p.Description,
                technologies = p.Technologies
            })
        }, new JsonSerializerOptions { WriteIndented = true });

        var prompt = $@"You are a professional career coach. Based on the following job description and the user's CV, please:

1. Create a tailored version of the CV in JSON format that highlights relevant skills and experiences for this specific job.
2. Generate a compelling cover letter that connects the candidate's experience to the job requirements.

IMPORTANT REQUIREMENTS:
- Use ONLY real information from the provided CV. Do NOT use placeholders, brackets, or generic text.
- Do NOT include placeholders like [Your Name], [Company Name], [Date], [Address], etc.
- Use actual names, dates, companies, and details from the CV provided.
- If information is missing from the CV, use empty strings for strings, empty arrays for arrays, or omit the field.
- For the cover letter: Start directly with the salutation (e.g., ""Dear Hiring Manager,"") and proceed with the body. Do NOT include addresses, dates, or headers at the top.

Job Description:
{jobDescription}

Original CV:
{cvJson}

For the tailored CV, provide a valid JSON object with the following structure:
{{
    ""name"": ""Full Name"",
    ""location"": ""City, Country"",
    ""email"": ""email@example.com"",
    ""phone"": ""phone number"",
    ""github"": ""https://github.com/username"",
    ""linkedin"": ""https://linkedin.com/in/username"",
    ""portfolio"": ""https://portfolio-url.com"",
    ""image"": ""image URL or file path (empty string if no image)"",
    ""summary"": ""Professional summary tailored to the job"",
    ""skills"": [""skill1"", ""skill2"", ""skill3""],
    ""experience"": [
        {{
            ""company"": ""Company Name"",
            ""position"": ""Job Title"",
            ""location"": ""City, Country"",
            ""startDate"": ""Month Year"",
            ""endDate"": ""Month Year or Present"",
            ""description"": [""Achievement 1"", ""Achievement 2""]
        }}
    ],
    ""education"": [
        {{
            ""institution"": ""University Name"",
            ""degree"": ""Degree Name"",
            ""field"": ""Field of Study"",
            ""location"": ""City, Country"",
            ""startDate"": ""Year"",
            ""endDate"": ""Year""
        }}
    ],
    ""certifications"": [""Certification 1"", ""Certification 2""],
    ""languages"": [""Language 1"", ""Language 2""],
    ""projects"": [
        {{
            ""name"": ""Project Name"",
            ""description"": ""Project description"",
            ""technologies"": [""tech1"", ""tech2""]
        }}
    ]
}}

Please provide your response in the following format:
TAILORED_CV_START
[valid JSON object here - use only real information from the CV, no placeholders]
TAILORED_CV_END

COVER_LETTER_START
[cover letter content here - start with salutation, no address/header, use only real information from the CV, no placeholders]
COVER_LETTER_END";

        var requestBody = new
        {
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        const int maxRetries = 3;
        
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                var url = $"{baseUrl}deployments/{deployment}/chat/completions?api-version={apiVersion}";
                
                _logger.LogInformation($"Calling Azure OpenAI (GPT-4o) API for CV tailoring (attempt {attempt + 1}/{maxRetries})");
                
                var response = await client.PostAsync(url, content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    if (attempt < maxRetries - 1)
                    {
                        _logger.LogWarning($"Azure OpenAI API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                        continue;
                    }
                    else
                    {
                        _logger.LogError($"Azure OpenAI API rate limited after {maxRetries} attempts");
                        throw new InvalidOperationException("Rate limit exceeded. Please wait a moment and try again.");
                    }
                }
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Azure OpenAI API error: Status {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Azure OpenAI API returned status {response.StatusCode}: {responseContent}");
                }

                var responseJson = JsonDocument.Parse(responseContent);
                
                if (!responseJson.RootElement.TryGetProperty("choices", out var choices) || 
                    choices.GetArrayLength() == 0)
                {
                    _logger.LogError($"Azure OpenAI API response missing choices: {responseContent}");
                    throw new InvalidOperationException("Azure OpenAI API response missing choices array");
                }
                
                var responseText = choices[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? "";

                // Parse the response
                var cvStart = responseText.IndexOf("TAILORED_CV_START");
                var cvEnd = responseText.IndexOf("TAILORED_CV_END");
                var letterStart = responseText.IndexOf("COVER_LETTER_START");
                var letterEnd = responseText.IndexOf("COVER_LETTER_END");

                if (cvStart == -1 || cvEnd == -1)
                    throw new Exception("Could not parse tailored CV from response");
                if (letterStart == -1 || letterEnd == -1)
                    throw new Exception("Could not parse cover letter from response");

                var tailoredCvJson = responseText.Substring(cvStart + "TAILORED_CV_START".Length, cvEnd - cvStart - "TAILORED_CV_START".Length).Trim();
                var coverLetter = responseText.Substring(letterStart + "COVER_LETTER_START".Length, letterEnd - letterStart - "COVER_LETTER_START".Length).Trim();

                // Clean up JSON
                tailoredCvJson = System.Text.RegularExpressions.Regex.Replace(tailoredCvJson, @"^```json\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                tailoredCvJson = System.Text.RegularExpressions.Regex.Replace(tailoredCvJson, @"^```\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
                tailoredCvJson = tailoredCvJson.Trim();

                // Remove placeholder patterns from cover letter
                var placeholderPatterns = new[]
                {
                    @"\[Your Name\]", @"\[your name\]", @"\[YOUR NAME\]",
                    @"\[Company Name\]", @"\[company name\]", @"\[COMPANY NAME\]",
                    @"\[Company\]", @"\[company\]",
                    @"\[Date\]", @"\[date\]", @"\[DATE\]",
                    @"\[Address\]", @"\[address\]", @"\[ADDRESS\]",
                    @"\[Phone\]", @"\[phone\]", @"\[PHONE\]",
                    @"\[Email\]", @"\[email\]", @"\[EMAIL\]",
                    @"\[Job Title\]", @"\[job title\]", @"\[JOB TITLE\]",
                    @"\[Years\]", @"\[years\]", @"\[YEARS\]",
                    @"\[Skill\]", @"\[skill\]", @"\[SKILL\]"
                };

                foreach (var pattern in placeholderPatterns)
                {
                    coverLetter = System.Text.RegularExpressions.Regex.Replace(coverLetter, pattern, "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                }

                // Clean up cover letter
                var lines = coverLetter.Split('\n')
                    .Select(line => line.Trim())
                    .Where(line => !string.IsNullOrWhiteSpace(line));
                coverLetter = string.Join("\n", lines);

                var tailoredCvData = JsonSerializer.Deserialize<Dictionary<string, object>>(tailoredCvJson);
                var tailoredCv = MapToResume(tailoredCvData!);

                return (tailoredCv, coverLetter);
            }
            catch (Exception ex) when (ex.Message.Contains("429") && attempt < maxRetries - 1)
            {
                _logger.LogWarning($"Azure OpenAI API rate limited. Retrying immediately (attempt {attempt + 1}/{maxRetries})...");
                continue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error tailoring CV (attempt {attempt + 1}/{maxRetries})");
                if (attempt == maxRetries - 1)
                {
                    throw new Exception($"Failed to tailor CV after {maxRetries} attempts: {ex.Message}", ex);
                }
                continue;
            }
        }
        
        throw new InvalidOperationException("Failed to tailor CV after multiple retry attempts.");
    }

    private Resume MapToResume(Dictionary<string, object> data)
    {
        var resume = new Resume();

        if (data.TryGetValue("name", out var name))
            resume.Name = name?.ToString() ?? "";
        if (data.TryGetValue("location", out var location))
            resume.Location = location?.ToString();
        if (data.TryGetValue("email", out var email))
            resume.Email = email?.ToString();
        if (data.TryGetValue("phone", out var phone))
            resume.Phone = phone?.ToString();
        if (data.TryGetValue("github", out var github))
            resume.GitHub = github?.ToString();
        if (data.TryGetValue("linkedin", out var linkedin))
            resume.LinkedIn = linkedin?.ToString();
        if (data.TryGetValue("portfolio", out var portfolio))
            resume.Portfolio = portfolio?.ToString();
        if (data.TryGetValue("image", out var image))
            resume.Image = image?.ToString();
        if (data.TryGetValue("summary", out var summary))
            resume.Summary = summary?.ToString();

        if (data.TryGetValue("skills", out var skills) && skills is JsonElement skillsElement)
            resume.Skills = skillsElement.EnumerateArray().Select(s => s.GetString() ?? "").ToList();
        
        if (data.TryGetValue("certifications", out var certs) && certs is JsonElement certsElement)
            resume.Certifications = certsElement.EnumerateArray().Select(c => c.GetString() ?? "").ToList();
        
        if (data.TryGetValue("languages", out var langs) && langs is JsonElement langsElement)
            resume.Languages = langsElement.EnumerateArray().Select(l => l.GetString() ?? "").ToList();

        if (data.TryGetValue("experience", out var exp) && exp is JsonElement expElement)
        {
            foreach (var expItem in expElement.EnumerateArray())
            {
                var experience = new Experience
                {
                    Company = expItem.GetProperty("company").GetString() ?? "",
                    Position = expItem.GetProperty("position").GetString() ?? "",
                    Location = expItem.TryGetProperty("location", out var loc) ? loc.GetString() : null,
                    StartDate = expItem.GetProperty("startDate").GetString() ?? "",
                    EndDate = expItem.TryGetProperty("endDate", out var end) ? end.GetString() : null,
                    IsCurrentPosition = expItem.TryGetProperty("endDate", out var endDate) && 
                                       (endDate.GetString()?.ToLower() == "present" || endDate.GetString()?.ToLower() == "current")
                };

                if (expItem.TryGetProperty("description", out var desc) && desc.ValueKind == JsonValueKind.Array)
                {
                    experience.Description = desc.EnumerateArray().Select(d => d.GetString() ?? "").ToList();
                }

                resume.Experiences.Add(experience);
            }
        }

        if (data.TryGetValue("education", out var edu) && edu is JsonElement eduElement)
        {
            foreach (var eduItem in eduElement.EnumerateArray())
            {
                var education = new Education
                {
                    Institution = eduItem.GetProperty("institution").GetString() ?? "",
                    Degree = eduItem.GetProperty("degree").GetString() ?? "",
                    Field = eduItem.TryGetProperty("field", out var field) ? field.GetString() : null,
                    Location = eduItem.TryGetProperty("location", out var loc) ? loc.GetString() : null,
                    StartDate = eduItem.TryGetProperty("startDate", out var start) ? start.GetString() : null,
                    EndDate = eduItem.TryGetProperty("endDate", out var end) ? end.GetString() : null
                };

                resume.Educations.Add(education);
            }
        }

        if (data.TryGetValue("projects", out var proj) && proj is JsonElement projElement)
        {
            foreach (var projItem in projElement.EnumerateArray())
            {
                var project = new Project
                {
                    Name = projItem.GetProperty("name").GetString() ?? "",
                    Description = projItem.TryGetProperty("description", out var desc) ? desc.GetString() : null,
                    Url = projItem.TryGetProperty("url", out var url) ? url.GetString() : null
                };

                if (projItem.TryGetProperty("technologies", out var tech) && tech.ValueKind == JsonValueKind.Array)
                {
                    project.Technologies = tech.EnumerateArray().Select(t => t.GetString() ?? "").ToList();
                }

                resume.Projects.Add(project);
            }
        }

        return resume;
    }
}

