import os
import re
import json
import dotenv
import google.generativeai as genai
import PyPDF2
from docx import Document

dotenv.load_dotenv()

MODEL_NAME = "gemini-2.5-flash"

def read_job_description() -> str:
    """Read job description from job_description.txt file."""
    job_desc_file = "job_description.txt"
    if not os.path.exists(job_desc_file):
        raise FileNotFoundError(f"Job description file not found: {job_desc_file}")
    
    with open(job_desc_file, 'r', encoding='utf-8') as f:
        content = f.read().strip()
        if not content:
            raise ValueError("Job description file is empty")
        return content

def read_cv_from_resume_folder() -> str:
    """Read CV from resume folder. Supports .pdf, .doc, and .docx files."""
    resume_folder = "resume"
    if not os.path.exists(resume_folder):
        raise FileNotFoundError(f"Resume folder not found: {resume_folder}")
    
    if not os.path.isdir(resume_folder):
        raise ValueError(f"{resume_folder} is not a directory")
    
    # Get all files in the resume folder
    files = [f for f in os.listdir(resume_folder) if os.path.isfile(os.path.join(resume_folder, f))]
    
    if not files:
        raise FileNotFoundError(f"No files found in {resume_folder} folder")
    
    # If multiple files, use the first one (or you could make it more specific)
    if len(files) > 1:
        print(f"Multiple files found in resume folder. Using: {files[0]}")
    
    cv_path = os.path.join(resume_folder, files[0])
    file_ext = os.path.splitext(cv_path)[1].lower()
    
    # Handle PDF files
    if file_ext == '.pdf':
        try:
            with open(cv_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                if not text.strip():
                    raise ValueError("Could not extract text from PDF. The PDF might be image-based or corrupted.")
                return text.strip()
        except Exception as e:
            raise ValueError(f"Error reading PDF file: {e}")
    
    # Handle DOCX files (modern Word format)
    elif file_ext == '.docx':
        try:
            doc = Document(cv_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            if not text.strip():
                raise ValueError("Could not extract text from DOCX file. The file might be empty or corrupted.")
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error reading DOCX file: {e}")
    
    # Handle DOC files (older Word format)
    elif file_ext == '.doc':
        try:
            # Try using textract if available, otherwise suggest conversion
            try:
                import textract
                text = textract.process(cv_path).decode('utf-8')
                if not text.strip():
                    raise ValueError("Could not extract text from DOC file.")
                return text.strip()
            except ImportError:
                raise ValueError(
                    "Reading .doc files requires the 'textract' library. "
                    "Please install it with: pip install textract\n"
                    "Alternatively, convert your .doc file to .docx format."
                )
        except Exception as e:
            raise ValueError(f"Error reading DOC file: {e}")
    
    # Handle text files as fallback
    else:
        try:
            with open(cv_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            raise ValueError(f"Error reading text file: {e}. Supported formats: .pdf, .doc, .docx, .txt")

def tailor_cv_and_generate_cover_letter(cv_content: str, job_description: str, image_path: str = None) -> tuple[dict, str]:
    """
    Use Gemini API to tailor CV and generate cover letter."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(MODEL_NAME)
    
    prompt = f"""You are a professional career coach. Based on the following job description and the user's CV, please:

    1. Create a tailored version of the CV in JSON format that highlights relevant skills and experiences for this specific job.
    2. Generate a compelling cover letter that connects the candidate's experience to the job requirements.

    IMPORTANT REQUIREMENTS:
    - Use ONLY real information from the provided CV. Do NOT use placeholders, brackets, or generic text.
    - Do NOT include placeholders like [Your Name], [Company Name], [Date], [Address], etc.
    - Use actual names, dates, companies, and details from the CV provided.
    - If information is missing from the CV, use empty strings for strings, empty arrays for arrays, or omit the field.
    - For the cover letter: Start directly with the salutation (e.g., "Dear Hiring Manager,") and proceed with the body. Do NOT include addresses, dates, or headers at the top.

    Job Description:
    {job_description}

    Original CV:
    {cv_content}

    For the tailored CV, provide a valid JSON object with the following structure:
    {{
        "name": "Full Name",
        "location": "City, Country",
        "email": "email@example.com",
        "phone": "phone number",
        "github": "https://github.com/username",
        "linkedin": "https://linkedin.com/in/username",
        "portfolio": "https://portfolio-url.com",
        "image": "image URL or file path (empty string if no image)",
        "summary": "Professional summary tailored to the job",
        "skills": ["skill1", "skill2", "skill3"],
        "experience": [
            {{
                "company": "Company Name",
                "position": "Job Title",
                "location": "City, Country",
                "startDate": "Month Year",
                "endDate": "Month Year or Present",
                "description": ["Achievement 1", "Achievement 2"]
            }}
        ],
        "education": [
            {{
                "institution": "University Name",
                "degree": "Degree Name",
                "field": "Field of Study",
                "location": "City, Country",
                "startDate": "Year",
                "endDate": "Year"
            }}
        ],
        "certifications": ["Certification 1", "Certification 2"],
        "languages": ["Language 1", "Language 2"],
        "projects": [
            {{
                "name": "Project Name",
                "description": "Project description",
                "technologies": ["tech1", "tech2"]
            }}
        ]
    }}

    Please provide your response in the following format:
    TAILORED_CV_START
    [valid JSON object here - use only real information from the CV, no placeholders]
    TAILORED_CV_END

    COVER_LETTER_START
    [cover letter content here - start with salutation, no address/header, use only real information from the CV, no placeholders]
    COVER_LETTER_END
    """
    
    response = model.generate_content(prompt)
    response_text = response.text
    
    # Parse the response
    cv_start = response_text.find("TAILORED_CV_START")
    cv_end = response_text.find("TAILORED_CV_END")
    letter_start = response_text.find("COVER_LETTER_START")
    letter_end = response_text.find("COVER_LETTER_END")
    
    if cv_start == -1 or cv_end == -1:
        raise ValueError("Could not parse tailored CV from response")
    if letter_start == -1 or letter_end == -1:
        raise ValueError("Could not parse cover letter from response")
    
    tailored_cv_json = response_text[cv_start + len("TAILORED_CV_START"):cv_end].strip()
    cover_letter = response_text[letter_start + len("COVER_LETTER_START"):letter_end].strip()
    
    # Clean up the JSON - remove markdown code blocks if present
    tailored_cv_json = re.sub(r'^```json\s*', '', tailored_cv_json, flags=re.MULTILINE)
    tailored_cv_json = re.sub(r'^```\s*', '', tailored_cv_json, flags=re.MULTILINE)
    tailored_cv_json = tailored_cv_json.strip()
    
    # Parse and validate JSON
    try:
        cv_data = json.loads(tailored_cv_json)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format in tailored CV: {e}")
    
    # Add image field if provided
    if image_path:
        cv_data["image"] = image_path
    elif "image" not in cv_data:
        cv_data["image"] = ""
    
    # Remove placeholder patterns from cover letter
    placeholder_patterns = [
        r'\[Your Name\]', r'\[your name\]', r'\[YOUR NAME\]',
        r'\[Company Name\]', r'\[company name\]', r'\[COMPANY NAME\]',
        r'\[Company\]', r'\[company\]',
        r'\[Date\]', r'\[date\]', r'\[DATE\]',
        r'\[Address\]', r'\[address\]', r'\[ADDRESS\]',
        r'\[Phone\]', r'\[phone\]', r'\[PHONE\]',
        r'\[Email\]', r'\[email\]', r'\[EMAIL\]',
        r'\[Job Title\]', r'\[job title\]', r'\[JOB TITLE\]',
        r'\[Years\]', r'\[years\]', r'\[YEARS\]',
        r'\[Skill\]', r'\[skill\]', r'\[SKILL\]',
        r'\[.*?placeholder.*?\]',  # Any text with "placeholder" in brackets
        r'\{.*?placeholder.*?\}',  # Any text with "placeholder" in braces
    ]
    
    for pattern in placeholder_patterns:
        cover_letter = re.sub(pattern, '', cover_letter, flags=re.IGNORECASE)
    
    # Clean up cover letter
    lines_letter = [line.strip() for line in cover_letter.split('\n') if line.strip()]
    cover_letter = '\n'.join(lines_letter)
    
    return cv_data, cover_letter

def populate_template(template_path: str, json_data: dict, output_path: str):
    """
    Populate an HTML template with data from JSON.
    
    Supports:
    - Simple placeholders: {{field}}
    - Conditionals: {{#field}}...{{/field}}
    - Loops: {{#list}}...{{/list}}
    - Nested structures
    """
    # Read template
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Add job_title if not present (use first experience position or empty)
    if 'job_title' not in json_data or not json_data['job_title']:
        if json_data.get('experience') and len(json_data['experience']) > 0:
            json_data['job_title'] = json_data['experience'][0].get('position', '')
        else:
            json_data['job_title'] = ''
    
    # Add comma-separated languages for templates that need it
    if 'languages' in json_data and isinstance(json_data['languages'], list):
        json_data['languages_comma_separated'] = ', '.join(json_data['languages'])
    
    # Add display text for GitHub, LinkedIn, and Portfolio URLs
    if 'github' in json_data and json_data['github']:
        github_url = json_data['github']
        # Extract clean display text (e.g., "github.com/username" or just "GitHub")
        if 'github.com' in github_url:
            json_data['github_display'] = github_url.replace('https://', '').replace('http://', '').replace('www.', '')
        else:
            json_data['github_display'] = 'GitHub'
    
    if 'linkedin' in json_data and json_data['linkedin']:
        linkedin_url = json_data['linkedin']
        # Extract clean display text
        if 'linkedin.com' in linkedin_url:
            json_data['linkedin_display'] = linkedin_url.replace('https://', '').replace('http://', '').replace('www.', '')
        else:
            json_data['linkedin_display'] = 'LinkedIn'
    
    if 'portfolio' in json_data and json_data['portfolio']:
        portfolio_url = json_data['portfolio']
        # Extract clean display text
        if portfolio_url.startswith('http'):
            json_data['portfolio_display'] = portfolio_url.replace('https://', '').replace('http://', '').replace('www.', '')
        else:
            json_data['portfolio_display'] = 'Portfolio'
    
    # Process template recursively
    template = process_template_recursive(template, json_data)
    
    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(template)
    
    print(f"Generated CV: {output_path}")

def process_template_recursive(template: str, data: dict) -> str:
    """Recursively process template with conditionals, loops, and placeholders."""
    result = template
    max_iterations = 10  # Prevent infinite loops
    iteration = 0
    
    while iteration < max_iterations:
        prev_result = result
        
        # Process loops first (they may contain conditionals)
        result = process_loops(result, data)
        
        # Process conditionals
        result = process_conditionals(result, data)
        
        # Replace simple placeholders
        result = replace_simple_placeholders(result, data)
        
        # If no changes, we're done
        if result == prev_result:
            break
        
        iteration += 1
    
    return result

def process_loops(template: str, data: dict) -> str:
    """Process list loops: {{#list}}...{{/list}}"""
    list_pattern = r'\{\{#(\w+_list)\}\}(.*?)\{\{/\1\}\}'
    
    def replace_list(match):
        list_name = match.group(1)
        content = match.group(2)
        
        # Extract the base field name (e.g., 'skills_list' -> 'skills')
        base_field = list_name.replace('_list', '')
        field_value = get_nested_value(data, base_field)
        
        if not isinstance(field_value, list) or len(field_value) == 0:
            return ''
        
        # Process each item in the list
        items_html = []
        for item in field_value:
            item_data = {}
            if isinstance(item, str):
                # Simple list item (like skills, languages, certifications)
                # Try to match the expected field name in the template
                if 'skill' in content.lower():
                    item_data = {'skill': item}
                elif 'language' in content.lower():
                    item_data = {'language': item}
                elif 'certification' in content.lower():
                    item_data = {'certification': item}
                elif 'tech' in content.lower():
                    item_data = {'tech': item}
                else:
                    item_data = {'item': item}
            elif isinstance(item, dict):
                # Complex list item (like experience, education, projects)
                item_data = item.copy()
                # Handle nested lists within items
                if 'description' in item and isinstance(item['description'], list):
                    item_data['description_list'] = [{'item': desc} for desc in item['description']]
                if 'technologies' in item and isinstance(item['technologies'], list):
                    item_data['technologies_list'] = [{'tech': tech} for tech in item['technologies']]
            
            # Merge item data with main data for nested processing
            merged_data = {**data, **item_data}
            # Process nested conditionals and loops in the content
            item_template = process_template_recursive(content, merged_data)
            items_html.append(item_template)
        
        return ''.join(items_html)
    
    return re.sub(list_pattern, replace_list, template, flags=re.DOTALL)

def process_conditionals(template: str, data: dict) -> str:
    """Process conditionals: {{#field}}...{{/field}}"""
    conditional_pattern = r'\{\{#(\w+)\}\}(.*?)\{\{/\1\}\}'
    
    def replace_conditional(match):
        field_name = match.group(1)
        content = match.group(2)
        
        # Skip if it's a list pattern (handled separately)
        if field_name.endswith('_list'):
            return match.group(0)
        
        # Check if field exists and is truthy
        field_value = get_nested_value(data, field_name)
        
        is_truthy = False
        if isinstance(field_value, list):
            is_truthy = len(field_value) > 0
        elif isinstance(field_value, str):
            is_truthy = bool(field_value.strip())
        elif field_value is not None:
            is_truthy = True
        
        if is_truthy:
            # Process nested conditionals and loops in the content
            processed_content = process_template_recursive(content, data)
            return processed_content
        else:
            return ''
    
    return re.sub(conditional_pattern, replace_conditional, template, flags=re.DOTALL)

def replace_simple_placeholders(template: str, data: dict) -> str:
    """Replace simple placeholders like {{field}} with values."""
    result = template
    
    # Find all placeholders (but not conditionals/loops)
    placeholder_pattern = r'\{\{([^#/][^}]*)\}\}'
    
    def replace_placeholder(match):
        field_name = match.group(1).strip()
        
        # Skip if it's a conditional or loop marker
        if field_name.startswith('#') or field_name.startswith('/'):
            return match.group(0)
        
        value = get_nested_value(data, field_name)
        
        if value is None:
            return ''
        elif isinstance(value, (list, dict)):
            return ''
        else:
            return str(value)
    
    result = re.sub(placeholder_pattern, replace_placeholder, result)
    
    return result

def get_nested_value(data: dict, key: str):
    """Get value from nested dictionary or return None."""
    if not isinstance(data, dict):
        return None
    
    keys = key.split('.')
    value = data
    for k in keys:
        if isinstance(value, dict) and k in value:
            value = value[k]
        else:
            return None
    return value

if __name__ == "__main__":
    # so we will take job description from user
    # based the read the user cv
    # and use google gemini api to taylor the cv and generate a cover letter
    # then save the cover letter and tailored cv as markdown files
    
    try:
        # Prompt user to paste job description in file
        print("Please paste the job description in 'job_description.txt' file.")
        print("Once done, enter 'Y' to proceed: ", end="")
        
        while True:
            user_input = input().strip().upper()
            if user_input == 'Y':
                break
            print("Please enter 'Y' when you're done pasting the job description: ", end="")
        
        # Read job description from file
        print("\nReading job description from file...")
        job_description = read_job_description()
        
        # Read CV from resume folder
        print("Reading CV from resume folder...")
        cv_content = read_cv_from_resume_folder()
        
        # Ask if user wants to add an image
        image_path = None
        print("\nDo you want to add a portrait image to your CV? (Y/N): ", end="")
        add_image = input().strip().upper()
        
        if add_image == 'Y':
            print("Enter the image link (URL) or local file path (must be a portrait image): ", end="")
            image_path = input().strip()
            if not image_path:
                print("No image path provided. Continuing without image.")
                image_path = None
        
        print("\nProcessing with Gemini API...")
        tailored_cv, cover_letter = tailor_cv_and_generate_cover_letter(cv_content, job_description, image_path)
        
        # Create generated_result folder if it doesn't exist
        output_folder = "generated_result"
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        # Save tailored CV to JSON file
        print("\nSaving tailored CV to JSON file...")
        cv_path = os.path.join(output_folder, "tailored_cv.json")
        with open(cv_path, 'w', encoding='utf-8') as f:
            json.dump(tailored_cv, f, indent=2, ensure_ascii=False)
        print(f"Saved to {cv_path}")
        
        # Save cover letter to markdown file
        print("Saving cover letter to markdown file...")
        letter_path = os.path.join(output_folder, "cover_letter.md")
        with open(letter_path, 'w', encoding='utf-8') as f:
            f.write(cover_letter)
        print(f"Saved to {letter_path}")
        
        print("\n✓ Successfully generated tailored CV and cover letter!")
        
    except Exception as e:
        print(f"Error: {e}")