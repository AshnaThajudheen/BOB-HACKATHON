from typing import Dict, Any, List
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def generate_docs(files: List[Dict[str, str]]) -> str:
    """
    Generates API documentation based on the codebase.
    """
    if not files:
        return "No files provided for documentation."
        
    # Combine a high level view of top 2 files for context
    combined_context = ""
    for f in files[:2]:
        chunks = chunk_file_content(f['content'], max_tokens=1500)
        combined_context += f"File: {f['path']}\n{chunks[0]}\n\n"
        
    prompt = f"Generate API documentation (OpenAPI/Swagger or Markdown format) for this code:\n\n{combined_context}"
    return call_watsonx(prompt)
