#!/usr/bin/env python3
"""
Script to generate CV PDF files from JSON data and templates using headless browser.
"""

import os
import json
import sys
import tempfile
from playwright.sync_api import sync_playwright
from main import populate_template

def generate_cv_from_template(template_name: str = None):
    """
    Generate CV HTML from JSON data using a template.
    
    Args:
        template_name: Name of template file (temp1.html, temp2.html, etc.)
                      If None, will prompt user to select.
    """
    # Load JSON data
    json_path = "generated_result/tailored_cv.json"
    if not os.path.exists(json_path):
        print(f"Error: JSON file not found at {json_path}")
        print("Please run main.py first to generate the CV JSON.")
        return
    
    with open(json_path, 'r', encoding='utf-8') as f:
        cv_data = json.load(f)
    
    # Select template
    templates_dir = "templates"
    available_templates = [f for f in os.listdir(templates_dir) if f.endswith('.html')]
    
    if not template_name:
        print("\nAvailable templates:")
        for i, template in enumerate(available_templates, 1):
            print(f"{i}. {template}")
        
        while True:
            try:
                choice = input(f"\nSelect template (1-{len(available_templates)}) or enter filename: ").strip()
                
                # Try as number first
                if choice.isdigit():
                    idx = int(choice) - 1
                    if 0 <= idx < len(available_templates):
                        template_name = available_templates[idx]
                        break
                # Try as filename
                elif choice in available_templates:
                    template_name = choice
                    break
                elif os.path.exists(os.path.join(templates_dir, choice)):
                    template_name = choice
                    break
                else:
                    print("Invalid selection. Please try again.")
            except (ValueError, KeyboardInterrupt):
                print("\nCancelled.")
                return
    
    template_path = os.path.join(templates_dir, template_name)
    
    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}")
        return
    
    # Generate output filename (PDF)
    output_name = template_name.replace('.html', '_cv.pdf')
    output_path = os.path.join("generated_result", output_name)
    
    # Generate CV HTML first (temporarily)
    print(f"\nGenerating CV from {template_name}...")
    with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as temp_html:
        temp_html_path = temp_html.name
        populate_template(template_path, cv_data, temp_html_path)
    
    # Convert HTML to PDF using headless browser
    print("Converting to PDF using headless browser...")
    try:
        # Get absolute path for the HTML file
        html_abs_path = os.path.abspath(temp_html_path)
        html_url = f"file://{html_abs_path}"
        
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Load the HTML file
            page.goto(html_url, wait_until='networkidle')
            
            # Wait for any fonts or resources to load
            page.wait_for_timeout(500)
            
            # Generate PDF with print settings
            page.pdf(
                path=output_path,
                format='A4',
                print_background=True,  # Preserve backgrounds and colors
                margin={
                    'top': '0',
                    'right': '0',
                    'bottom': '0',
                    'left': '0'
                }
            )
            
            browser.close()
        
        print(f"\n✓ CV PDF generated successfully: {output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}")
        print("Make sure Playwright is installed: pip install playwright")
        print("Then install browsers: playwright install chromium")
        raise
    finally:
        # Clean up temporary HTML file
        if os.path.exists(temp_html_path):
            os.remove(temp_html_path)

if __name__ == "__main__":
    template_name = sys.argv[1] if len(sys.argv) > 1 else None
    generate_cv_from_template(template_name)

