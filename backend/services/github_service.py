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
        return parts[-2], parts[-1]
    raise ValueError("Invalid GitHub URL format")

def fetch_repository_files(url: str) -> List[Dict[str, str]]:
    """
    Fetches the repository structure and downloads file contents.
    For simplicity, fetches the default branch tree and downloads top level files.
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
    
    files = []
    # Fetching up to 10 blobs to avoid huge wait times
    blobs = [item for item in tree if item['type'] == 'blob']
    
    for item in blobs[:10]:
        file_path = item['path']
        # Skip binaries based on basic extension check
        if any(file_path.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip']):
            continue
            
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{file_path}"
        raw_resp = requests.get(raw_url, headers=headers)
        if raw_resp.status_code == 200:
            files.append({
                "path": file_path,
                "content": raw_resp.text
            })
            
    return files
