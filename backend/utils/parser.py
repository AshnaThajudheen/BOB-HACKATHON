import tiktoken
from typing import List, Dict

# Using cl100k_base as an approximation for token limits
encoding = tiktoken.get_encoding("cl100k_base")

def get_token_count(text: str) -> int:
    return len(encoding.encode(text))

def chunk_file_content(content: str, max_tokens: int = 3000) -> List[str]:
    """
    Chunks file content into segments of max_tokens to stay within context limits.
    """
    tokens = encoding.encode(content)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunks.append(encoding.decode(chunk_tokens))
    return chunks

def get_top_files(files: List[Dict[str, str]], limit: int = 5) -> List[Dict[str, str]]:
    """
    Given a list of file dictionaries (path and content), select the top priority files.
    Filters out common build/dependency artifacts and selects core source files.
    """
    ignored_patterns = [
        'node_modules/', 'venv/', '.git/', '__pycache__/', 
        'dist/', 'build/', 'package-lock.json', '.DS_Store'
    ]
    
    valid_files = []
    for f in files:
        if not any(pattern in f['path'] for pattern in ignored_patterns):
            valid_files.append(f)
            
    # Naive prioritization: maybe prioritize python/js/ts over json/md files for logic
    # Here we just take the first N valid files as a placeholder for more advanced heuristic.
    return valid_files[:limit]
