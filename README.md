# CV Tailoring & Generation System

An intelligent CV tailoring system that uses Google Gemini AI to customize your CV for specific job descriptions and generates professional CVs in multiple template formats.

## Features

- 🤖 **AI-Powered CV Tailoring**: Uses Google Gemini API to tailor your CV based on job descriptions
- 📝 **Cover Letter Generation**: Automatically generates personalized cover letters
- 🎨 **Multiple Templates**: 4 professional CV templates to choose from
- 📄 **PDF Generation**: Generate PDFs using headless browser for perfect formatting
- 🖼️ **Image Support**: Add portrait images to your CV (PDF, DOC, DOCX formats supported)
- 🔗 **Social Links**: Support for GitHub, LinkedIn, and portfolio URLs with proper icons
- 📋 **Structured JSON Output**: CV data stored in JSON format for easy template customization

## Project Structure

```
portfolio/
├── main.py                 # Main script for CV tailoring and generation
├── generate_cv.py          # Script to generate CV PDFs from templates
├── requirements.txt        # Python dependencies
├── templates/             # HTML CV templates
│   ├── temp1.html
│   ├── temp2.html
│   ├── temp3.html
│   └── temp4.html
├── resume/                # Place your CV file here (PDF, DOC, or DOCX)
├── job_description.txt    # Paste job description here
├── generated_result/       # Output folder
│   ├── tailored_cv.json   # Generated tailored CV in JSON format
│   ├── cover_letter.md    # Generated cover letter
│   └── [template]_cv.pdf  # Generated CV PDFs
└── .env                   # Environment variables (create this file)
```

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Playwright Browser (for PDF generation)

```bash
playwright install chromium
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Prepare Your Files

- Place your CV file (PDF, DOC, or DOCX) in the `resume/` folder
- When running the script, paste the job description in `job_description.txt`

## Usage

### Step 1: Generate Tailored CV and Cover Letter

1. Paste the job description in `job_description.txt`
2. Run the main script:

```bash
python main.py
```

3. Follow the prompts:
   - Enter 'Y' when you've pasted the job description
   - Choose whether to add a portrait image (optional)
   - Enter image URL or path if adding an image

The script will:
- Read your CV from the `resume/` folder
- Tailor it using Google Gemini AI
- Generate a cover letter
- Save both as `tailored_cv.json` and `cover_letter.md` in `generated_result/`

### Step 2: Generate CV PDF from Template

```bash
python generate_cv.py
```

Or specify a template directly:

```bash
python generate_cv.py temp1.html
```

The script will:
- Load the tailored CV JSON
- Let you select a template (if not specified)
- Generate a PDF using headless browser
- Save it as `[template]_cv.pdf` in `generated_result/`

## CV Data Structure

The generated `tailored_cv.json` contains:

```json
{
  "name": "Full Name",
  "location": "City, Country",
  "email": "email@example.com",
  "phone": "+1234567890",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "portfolio": "https://portfolio-url.com",
  "image": "image URL or path",
  "summary": "Professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": ["Achievement 1", "Achievement 2", ...]
    }
  ],
  "education": [...],
  "certifications": [...],
  "languages": [...],
  "projects": [...]
}
```

## Templates

### Template 1
- Sidebar layout with profile image
- Skills and languages in sidebar
- Clean, professional design

### Template 2
- Reversed layout (sidebar on right)
- Modern, minimalist design
- Great for tech professionals

### Template 3
- Single-column layout
- Classic, traditional design
- Perfect for formal applications

### Template 4
- Header with profile image
- Two-column main content
- Modern, structured layout

## Customization

### Adding New Templates

1. Create a new HTML file in the `templates/` folder
2. Use the placeholder syntax:
   - `{{field}}` for simple fields
   - `{{#field}}...{{/field}}` for conditionals
   - `{{#list}}...{{/list}}` for loops
3. Add print styles for PDF generation

### Modifying Templates

Templates use Mustache-like syntax:
- `{{name}}` - Simple placeholder
- `{{#skills}}...{{/skills}}` - Conditional block
- `{{#experience_list}}...{{/experience_list}}` - Loop

## Print/PDF Settings

All templates include print styles that:
- Remove browser headers and footers
- Preserve colors and backgrounds
- Fit content to A4 page size
- Maintain professional appearance

## Requirements

- Python 3.7+
- Google Gemini API key
- Playwright (for PDF generation)

## Troubleshooting

### Playwright Installation Issues

If PDF generation fails:
```bash
playwright install chromium
```

### API Key Issues

Make sure your `.env` file contains:
```
GOOGLE_API_KEY=your_actual_key_here
```

### CV File Not Found

Ensure your CV file is in the `resume/` folder and is in PDF, DOC, or DOCX format.

## License

This project is open source and available for personal and commercial use.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

