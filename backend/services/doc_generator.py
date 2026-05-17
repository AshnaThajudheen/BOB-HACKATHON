from typing import Dict, Any, List, Optional
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def generate_docs(files: List[Dict[str, str]], api_endpoints: Optional[List[Dict[str, str]]] = None, framework: str = "Unknown") -> str:
    """
    Generates comprehensive API documentation based on the codebase.
    Uses improved prompts for structured documentation output.
    """
    if not files:
        return "No files provided for documentation."
    
    # Build context from files
    combined_context = ""
    for f in files[:3]:
        chunks = chunk_file_content(f['content'], max_tokens=1200)
        combined_context += f"\n### File: {f['path']}\n```\n{chunks[0]}\n```\n"
    
    # Add API endpoints if detected
    endpoints_context = ""
    if api_endpoints:
        endpoints_context = "\n\n## Detected API Endpoints:\n"
        for ep in api_endpoints[:10]:
            endpoints_context += f"- {ep['method']} {ep['path']} (in {ep['file']})\n"
    
    # Improved prompt for structured documentation
    prompt = f"""You are a senior technical writer. Create production-ready API documentation for this {framework if framework != 'Unknown' else ''} application.

{combined_context}
{endpoints_context}

**Generate:**
1. **API Overview** - Brief description of the API purpose
2. **Endpoints** - For each endpoint, provide:
   - Method and path
   - Description (1 sentence)
   - Request parameters/body (if applicable)
   - Response format
   - Example request/response
3. **Authentication** - If detected, explain auth mechanism
4. **Error Codes** - Common HTTP status codes

**Format Requirements:**
- Use markdown tables for parameters
- Include JSON examples in code blocks
- Keep descriptions concise (2-3 sentences max)
- Use proper REST API documentation style

Generate professional, developer-friendly documentation. Avoid placeholder text.
"""
    
    result = call_watsonx(prompt)
    
    # Ensure markdown formatting
    if not result.startswith('#'):
        result = f"# API Documentation\n\n{result}"
    
    return result

# Made with Bob
