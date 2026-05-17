from typing import Dict, Any, List
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def generate_tests(files: List[Dict[str, str]], language: str = "Unknown", framework: str = "Unknown") -> str:
    """
    Generates comprehensive unit tests based on the repository files.
    Uses improved prompts for better AI output.
    """
    if not files:
        return "No files provided for test generation."
    
    # Select primary files for test generation
    primary_files = files[:3]
    
    # Build context from multiple files
    context = ""
    for file in primary_files:
        chunks = chunk_file_content(file['content'], max_tokens=1500)
        context += f"\n### File: {file['path']}\n```\n{chunks[0]}\n```\n"
    
    # Improved prompt for structured test generation
    prompt = f"""You are an expert QA engineer. Generate clean, production-ready unit tests for this {language} code{' using ' + framework if framework != 'Unknown' else ''}.

{context}

**Requirements:**
- Write 3-5 focused test cases covering critical functionality
- Include edge cases and error scenarios
- Use proper testing framework syntax (pytest, jest, junit, etc.)
- Keep explanations brief (1-2 sentences per test)
- Format as markdown with syntax-highlighted code blocks

**Output Format:**
## Test Suite for [Component Name]

### Test Case 1: [Brief Description]
```[language]
[test code]
```

Generate concise, developer-ready tests. Avoid verbose explanations.
"""
    
    result = call_watsonx(prompt)
    
    # Ensure markdown formatting
    if not result.startswith('#'):
        result = f"# Generated Unit Tests\n\n{result}"
    
    return result

# Made with Bob
