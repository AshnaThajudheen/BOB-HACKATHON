from typing import Dict, Any, List
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def explain_code(files: List[Dict[str, str]]) -> str:
    """
    Generates a human-readable explanation of the codebase structure and logic.
    """
    if not files:
        return "No files provided for explanation."
        
    combined_context = ""
    for f in files[:3]:
        chunks = chunk_file_content(f['content'], max_tokens=1000)
        combined_context += f"File: {f['path']}\n{chunks[0]}\n\n"
        
    prompt = f"Explain the logic, purpose, and structure of the following code snippet to a developer:\n\n{combined_context}"
    return call_watsonx(prompt)
