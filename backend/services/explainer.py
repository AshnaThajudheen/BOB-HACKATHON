from typing import Dict, Any, List
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def explain_code(files: List[Dict[str, str]], language: str = "Unknown", framework: str = "Unknown") -> str:
    """
    Generates human-readable explanations of the codebase structure and logic.
    Uses improved prompts for better AI output.
    """
    if not files:
        return "No files provided for explanation."
    
    # Build context from multiple files
    combined_context = ""
    for f in files[:4]:
        chunks = chunk_file_content(f['content'], max_tokens=1000)
        combined_context += f"\n### File: {f['path']}\n```\n{chunks[0]}\n```\n"
    
    # Improved prompt for code explanation
    prompt = f"""You are a senior software architect. Provide a clear, concise explanation of this {language} codebase{' using ' + framework if framework != 'Unknown' else ''} for a new team member.

{combined_context}

**Explain:**

1. **🏗️ Architecture Overview** (2-3 sentences)
   - Overall design pattern and structure
   - Key architectural decisions

2. **🔧 Core Components** (bullet points)
   - Main modules/classes and their single responsibility
   - How components interact

3. **🔄 Data Flow** (brief description)
   - How requests/data move through the system
   - Key transformations

4. **⚡ Critical Functions** (top 3-4)
   - Most important functions and what they do
   - Why they matter

5. **📦 Dependencies** (if notable)
   - Key external libraries and their purpose

**Style:**
- Use clear, technical language
- Keep each section under 5 sentences
- Use bullet points for lists
- Include code snippets only if essential

Generate a professional code walkthrough that helps developers understand the codebase quickly.
"""
    
    result = call_watsonx(prompt)
    
    # Ensure markdown formatting
    if not result.startswith('#'):
        result = f"# Code Explanation\n\n{result}"
    
    return result

# Made with Bob
