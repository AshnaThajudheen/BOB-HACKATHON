import tiktoken
from typing import List, Dict, Tuple
import re

# Using cl100k_base as an approximation for token limits
encoding = tiktoken.get_encoding("cl100k_base")

# Source code extensions to analyze
SOURCE_CODE_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.h', 
    '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala', '.cs'
}

# Files and directories to ignore
IGNORED_PATTERNS = [
    # Version control
    '.git/', '.github/', '.gitignore', '.gitattributes',
    # Dependencies
    'node_modules/', 'venv/', 'env/', '.venv/', '__pycache__/', 
    'vendor/', 'packages/',
    # Build outputs
    'dist/', 'build/', 'out/', 'target/', '.next/', '.nuxt/',
    # Lock files
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'Pipfile.lock',
    'poetry.lock', 'Gemfile.lock', 'composer.lock',
    # Config files (analyze selectively)
    '.env', '.env.local', '.env.production',
    # Documentation (not code)
    'README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md',
    # Issue templates
    'ISSUE_TEMPLATE/', 'PULL_REQUEST_TEMPLATE/',
    # Binary and media
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf', 
    '.zip', '.tar', '.gz', '.exe', '.dll', '.so',
    # IDE
    '.vscode/', '.idea/', '.DS_Store',
    # Test coverage
    'coverage/', '.coverage', '.nyc_output/',
    # Misc
    '.cache/', 'tmp/', 'temp/'
]

# Framework detection patterns
FRAMEWORK_PATTERNS = {
    'FastAPI': [r'from fastapi import', r'FastAPI\(', r'@app\.(get|post|put|delete)'],
    'Flask': [r'from flask import', r'Flask\(__name__\)', r'@app\.route'],
    'Django': [r'from django', r'django\.', r'INSTALLED_APPS'],
    'Express': [r'express\(\)', r'app\.use\(', r'require\([\'"]express[\'"]\)'],
    'React': [r'import React', r'from [\'"]react[\'"]', r'useState|useEffect'],
    'Next.js': [r'next/', r'getServerSideProps', r'getStaticProps'],
    'Vue': [r'import.*vue', r'createApp', r'<template>'],
    'Angular': [r'@angular/', r'@Component', r'@NgModule'],
    'Spring Boot': [r'@SpringBootApplication', r'@RestController', r'springframework'],
    'Node.js': [r'require\(', r'module\.exports', r'process\.env'],
}

# Language detection by extension
LANGUAGE_MAP = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.go': 'Go',
    '.rs': 'Rust',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.cs': 'C#',
}

def get_token_count(text: str) -> int:
    """Get token count for text."""
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

def is_source_code_file(file_path: str) -> bool:
    """Check if file is a source code file we should analyze."""
    # Check extension
    ext = '.' + file_path.split('.')[-1] if '.' in file_path else ''
    if ext not in SOURCE_CODE_EXTENSIONS:
        return False
    
    # Check against ignored patterns
    for pattern in IGNORED_PATTERNS:
        if pattern in file_path:
            return False
    
    return True

def detect_language(files: List[Dict[str, str]]) -> str:
    """Detect primary programming language from files."""
    language_counts = {}
    
    for file in files:
        ext = '.' + file['path'].split('.')[-1] if '.' in file['path'] else ''
        if ext in LANGUAGE_MAP:
            lang = LANGUAGE_MAP[ext]
            language_counts[lang] = language_counts.get(lang, 0) + 1
    
    if not language_counts:
        return 'Unknown'
    
    # Return most common language
    return max(language_counts.items(), key=lambda x: x[1])[0]

def detect_framework(files: List[Dict[str, str]]) -> str:
    """Detect framework from file contents."""
    combined_content = '\n'.join([f['content'][:5000] for f in files[:10]])
    
    detected_frameworks = []
    for framework, patterns in FRAMEWORK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, combined_content, re.IGNORECASE):
                detected_frameworks.append(framework)
                break
    
    if not detected_frameworks:
        return 'Unknown'
    
    # Return first detected or combine if multiple
    return ', '.join(detected_frameworks[:2])

def extract_api_endpoints(files: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Extract API endpoints from code."""
    endpoints = []
    
    # Patterns for different frameworks
    patterns = {
        'FastAPI/Flask': r'@app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]',
        'Express': r'app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]',
        'Spring': r'@(Get|Post|Put|Delete|Patch)Mapping\([\'"]([^\'"]+)[\'"]',
    }
    
    for file in files:
        content = file['content']
        for framework, pattern in patterns.items():
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                method = match.group(1).upper()
                path = match.group(2)
                endpoints.append({
                    'method': method,
                    'path': path,
                    'file': file['path']
                })
    
    return endpoints

def calculate_metrics(files: List[Dict[str, str]]) -> Dict[str, any]:  # type: ignore
    """Calculate repository metrics."""
    total_lines = sum(len(f['content'].split('\n')) for f in files)
    total_files = len(files)
    
    # Estimate test coverage based on test file presence
    test_files = [f for f in files if 'test' in f['path'].lower() or 'spec' in f['path'].lower()]
    estimated_coverage = min(85, (len(test_files) / max(total_files, 1)) * 100 + 20)
    
    return {
        'total_files': total_files,
        'total_lines': total_lines,
        'test_files': len(test_files),
        'estimated_coverage': round(estimated_coverage, 1)
    }

def get_top_files(files: List[Dict[str, str]], limit: int = 10) -> List[Dict[str, str]]:
    """
    Select top priority source code files for analysis.
    Filters intelligently and prioritizes core application files.
    """
    # Filter to only source code files
    valid_files = [f for f in files if is_source_code_file(f['path'])]
    
    # Prioritization scoring
    def score_file(file_path: str) -> int:
        score = 0
        path_lower = file_path.lower()
        
        # Prioritize main application files
        if any(x in path_lower for x in ['main.', 'app.', 'index.', 'server.', 'api.']):
            score += 10
        
        # Prioritize route/controller files
        if any(x in path_lower for x in ['route', 'controller', 'handler', 'view']):
            score += 8
        
        # Prioritize service/model files
        if any(x in path_lower for x in ['service', 'model', 'schema', 'entity']):
            score += 6
        
        # Prioritize files in src/ or app/ directories
        if any(x in path_lower for x in ['src/', 'app/', 'lib/']):
            score += 5
        
        # Deprioritize test files (but don't exclude)
        if any(x in path_lower for x in ['test', 'spec', '__test__']):
            score -= 3
        
        # Deprioritize config files
        if any(x in path_lower for x in ['config', 'setup', 'webpack', 'babel']):
            score -= 2
        
        return score
    
    # Sort by score
    scored_files = [(f, score_file(f['path'])) for f in valid_files]
    scored_files.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N files
    return [f[0] for f in scored_files[:limit]]

def detect_missing_documentation(files: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Detect potentially undocumented code sections with severity levels."""
    issues = []
    
    for file in files[:5]:  # Check first 5 files
        content = file['content']
        lines = content.split('\n')
        file_name = file['path'].split('/')[-1]
        
        # Check for functions without docstrings (Python)
        if file['path'].endswith('.py'):
            func_pattern = r'^\s*def\s+(\w+)\s*\('
            for i, line in enumerate(lines):
                match = re.match(func_pattern, line)
                if match:
                    func_name = match.group(1)
                    # Skip private/internal functions
                    if func_name.startswith('_'):
                        continue
                    # Check if next non-empty line is a docstring
                    next_lines = [l.strip() for l in lines[i+1:i+3] if l.strip()]
                    if not next_lines or not (next_lines[0].startswith('"""') or next_lines[0].startswith("'''")):
                        severity = "high" if func_name in ['main', 'init', 'setup'] else "medium"
                        issues.append({
                            "type": "function",
                            "name": func_name,
                            "file": file_name,
                            "severity": severity,
                            "suggestion": "Add docstring describing parameters, return value, and purpose"
                        })
        
        # Check for classes without docstrings
        if file['path'].endswith(('.py', '.java', '.ts', '.js')):
            class_pattern = r'^\s*class\s+(\w+)'
            for i, line in enumerate(lines):
                match = re.match(class_pattern, line)
                if match:
                    class_name = match.group(1)
                    if i + 1 < len(lines):
                        next_line = lines[i + 1].strip()
                        if not next_line.startswith(('"""', "'''", '/*', '//')):
                            issues.append({
                                "type": "class",
                                "name": class_name,
                                "file": file_name,
                                "severity": "high",
                                "suggestion": "Add class docstring explaining purpose and usage"
                            })
        
        # Check for API endpoints without documentation
        if file['path'].endswith('.py'):
            endpoint_pattern = r'@app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]\)'
            for i, line in enumerate(lines):
                match = re.search(endpoint_pattern, line)
                if match:
                    method = match.group(1).upper()
                    path = match.group(2)
                    # Check if function below has docstring
                    func_line_idx = i + 1
                    if func_line_idx < len(lines):
                        func_match = re.search(r'def\s+(\w+)', lines[func_line_idx])
                        if func_match:
                            func_name = func_match.group(1)
                            next_lines = [l.strip() for l in lines[func_line_idx+1:func_line_idx+3] if l.strip()]
                            if not next_lines or not (next_lines[0].startswith('"""') or next_lines[0].startswith("'''")):
                                issues.append({
                                    "type": "endpoint",
                                    "name": f"{method} {path}",
                                    "file": file_name,
                                    "severity": "high",
                                    "suggestion": "Document request/response format and authentication requirements"
                                })
    
    return issues[:12]  # Return top 12 issues

def generate_architecture_summary(files: List[Dict[str, str]], language: str, framework: str) -> str:
    """Generate intelligent architecture summary."""
    
    # Detect patterns
    has_api = any('route' in f['path'].lower() or 'api' in f['path'].lower() for f in files)
    has_models = any('model' in f['path'].lower() or 'schema' in f['path'].lower() for f in files)
    has_services = any('service' in f['path'].lower() for f in files)
    has_middleware = any('middleware' in f['path'].lower() for f in files)
    has_tests = any('test' in f['path'].lower() for f in files)
    has_db = any('db' in f['path'].lower() or 'database' in f['path'].lower() for f in files)
    has_utils = any('util' in f['path'].lower() or 'helper' in f['path'].lower() for f in files)
    
    # Build architecture description
    patterns = []
    if has_api and has_services and has_models:
        patterns.append("layered architecture with separation of concerns")
    if has_middleware:
        patterns.append("middleware-based request processing")
    if has_services:
        patterns.append("service-oriented design")
    if has_models:
        patterns.append("data modeling layer")
    if has_tests:
        patterns.append("test-driven development practices")
    
    architecture_desc = f"This repository implements a {language}"
    if framework != "Unknown":
        architecture_desc += f" application using {framework}"
    
    if patterns:
        architecture_desc += f" with {', '.join(patterns)}."
    else:
        architecture_desc += " application."
    
    # Add component details
    components = []
    if has_api:
        components.append("API Routes")
    if has_services:
        components.append("Business Logic Services")
    if has_models:
        components.append("Data Models")
    if has_middleware:
        components.append("Middleware")
    if has_db:
        components.append("Database Layer")
    if has_utils:
        components.append("Utility Functions")
    if has_tests:
        components.append("Test Suite")
    
    if components:
        architecture_desc += f" Key components include: {', '.join(components)}."
    
    return architecture_desc

def generate_architecture_flow(files: List[Dict[str, str]], framework: str) -> str:
    """Generate architecture flow visualization."""
    
    # Detect components
    has_api = any('route' in f['path'].lower() or 'api' in f['path'].lower() for f in files)
    has_services = any('service' in f['path'].lower() for f in files)
    has_models = any('model' in f['path'].lower() or 'schema' in f['path'].lower() for f in files)
    has_db = any('db' in f['path'].lower() or 'database' in f['path'].lower() for f in files)
    has_middleware = any('middleware' in f['path'].lower() for f in files)
    
    # Build flow
    flow = ["Client/User"]
    
    if has_middleware:
        flow.append("Middleware Layer")
    
    if has_api:
        flow.append("API Routes/Controllers")
    
    if has_services:
        flow.append("Business Logic Services")
    
    if has_models:
        flow.append("Data Models/Schemas")
    
    if has_db:
        flow.append("Database/Storage")
    
    return " → ".join(flow)

def generate_repository_structure_summary(files: List[Dict[str, str]]) -> str:
    """Generate clean architectural structure summary instead of raw file list."""
    
    # Extract directory structure
    directories = set()
    for file in files:
        path_parts = file['path'].split('/')
        # Build directory hierarchy
        for i in range(1, len(path_parts)):
            dir_path = '/'.join(path_parts[:i])
            if dir_path:
                directories.add(dir_path)
    
    # Organize by top-level directories
    top_level_dirs = {}
    for dir_path in directories:
        parts = dir_path.split('/')
        top_level = parts[0]
        if top_level not in top_level_dirs:
            top_level_dirs[top_level] = set()
        if len(parts) > 1:
            top_level_dirs[top_level].add('/'.join(parts[1:]))
    
    # Build clean structure
    structure_lines = []
    for top_dir in sorted(top_level_dirs.keys()):
        structure_lines.append(f"**/{top_dir}/**")
        subdirs = sorted(top_level_dirs[top_dir])
        if subdirs:
            # Show only first few subdirectories
            for subdir in list(subdirs)[:5]:
                structure_lines.append(f"  - {subdir}/")
            if len(subdirs) > 5:
                structure_lines.append(f"  - ... and {len(subdirs) - 5} more")
    
    return '\n'.join(structure_lines) if structure_lines else "Single-level directory structure"

def calculate_ai_confidence(files: List[Dict[str, str]], metrics: Dict) -> int:
    """Calculate AI confidence score based on analysis quality."""
    confidence = 70  # Base confidence
    
    # More files analyzed = higher confidence
    if len(files) >= 10:
        confidence += 10
    elif len(files) >= 5:
        confidence += 5
    
    # Good test coverage = higher confidence
    if metrics.get('estimated_coverage', 0) > 70:
        confidence += 10
    elif metrics.get('estimated_coverage', 0) > 50:
        confidence += 5
    
    # Well-structured code = higher confidence
    if metrics.get('test_files', 0) > 0:
        confidence += 5
    
    # Cap at 95% (never 100% to show humility)
    return min(confidence, 95)

# Made with Bob
