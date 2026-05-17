import os
import requests
from typing import List, Dict

GITHUB_API_URL = "https://api.github.com"

def get_github_headers() -> Dict[str, str]:
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_TOKEN")
    if token and token != "your_github_personal_access_token_here":
        headers["Authorization"] = f"token {token}"
    return headers

def parse_github_url(url: str) -> tuple:
    """Extracts owner and repo from a GitHub URL."""
    # Assuming url format: https://github.com/owner/repo
    parts = url.rstrip('/').split('/')
    if len(parts) >= 2:
        repo = parts[-1]
        if repo.endswith('.git'):
            repo = repo[:-4]
        return parts[-2], repo
    raise ValueError("Invalid GitHub URL format")

def fetch_repository_files(url: str) -> List[Dict[str, str]]:
    """
    Fetches the repository structure and downloads file contents.
    Intelligently filters to only source code files.
    """
    owner, repo = parse_github_url(url)
    headers = get_github_headers()
    
    # 1. Get default branch
    repo_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}"
    resp = requests.get(repo_url, headers=headers)
    resp.raise_for_status()
    default_branch = resp.json().get('default_branch', 'main')
    
    # 2. Get tree (recursive)
    tree_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
    tree_resp = requests.get(tree_url, headers=headers)
    tree_resp.raise_for_status()
    tree = tree_resp.json().get('tree', [])
    
    # Source code extensions to prioritize
    source_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.go', '.rs', '.rb', '.php'}
    
    # Patterns to ignore
    ignore_patterns = [
        'node_modules/', '.git/', '__pycache__/', 'venv/', 'dist/', 'build/',
        '.github/', 'coverage/', '.next/', '.nuxt/', 'vendor/', 'target/',
        'package-lock.json', 'yarn.lock', '.env', 'LICENSE', 'README.md'
    ]
    
    files = []
    blobs = [item for item in tree if item['type'] == 'blob']
    
    # Filter and prioritize source code files
    source_files = []
    for item in blobs:
        file_path = item['path']
        
        # Skip ignored patterns
        if any(pattern in file_path for pattern in ignore_patterns):
            continue
        
        # Skip binary files
        if any(file_path.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.exe', '.dll']):
            continue
        
        # Check if it's a source code file
        ext = '.' + file_path.split('.')[-1] if '.' in file_path else ''
        if ext in source_extensions:
            source_files.append(item)
    
    # Fetch up to 25 source files (increased from 10)
    for item in source_files[:25]:
        file_path = item['path']
        try:
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{file_path}"
            raw_resp = requests.get(raw_url, headers=headers, timeout=5)
            if raw_resp.status_code == 200:
                # Only include text files (skip if content looks binary)
                try:
                    content = raw_resp.text
                    # Basic check for binary content
                    if '\x00' not in content[:1000]:
                        files.append({
                            "path": file_path,
                            "content": content
                        })
                except UnicodeDecodeError:
                    continue
        except Exception as e:
            print(f"Error fetching {file_path}: {e}")
            continue
            
    return files
