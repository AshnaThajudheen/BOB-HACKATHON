from typing import Dict, Any, List
from services.watsonx_service import call_watsonx
from utils.parser import chunk_file_content

def generate_tests(files: List[Dict[str, str]]) -> str:
    """
    Generates unit tests based on the top selected files.
    """
    if not files:
        return "No files provided for test generation."
        
    # We will generate tests for the first file as a prototype
    primary_file = files[0]
    chunks = chunk_file_content(primary_file['content'])
    
    # Analyze the first chunk to stay within limits
    prompt = f"Generate unit tests and edge cases for the following code:\n\n{chunks[0]}"
    return call_watsonx(prompt)
