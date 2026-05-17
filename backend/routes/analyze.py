from fastapi import APIRouter, BackgroundTasks, HTTPException
import uuid
from datetime import datetime
from models.schemas import AnalyzeRequest
from db.storage import save_analysis, get_analysis
from models.schemas import AnalyzeResponse
from services.github_service import fetch_repository_files
from utils.parser import (
    get_top_files, detect_language, detect_framework,
    extract_api_endpoints, calculate_metrics, detect_missing_documentation,
    generate_architecture_summary, generate_architecture_flow,
    generate_repository_structure_summary, calculate_ai_confidence
)
from services.test_generator import generate_tests
from services.doc_generator import generate_docs
from services.explainer import explain_code

router = APIRouter()

def run_analysis(result_id: str, req: AnalyzeRequest):
    """Run comprehensive repository analysis with AI."""
    # Fetch current record to update it
    analysis = get_analysis(result_id)
    if not analysis:
        return

    try:
        # 1. Fetch Repository Files (with intelligent filtering)
        all_files = fetch_repository_files(str(req.url))
        
        if not all_files:
            raise Exception("No source code files found in repository")
        
        # 2. Detect Language and Framework
        language = detect_language(all_files)
        framework = detect_framework(all_files)
        
        # 3. Calculate Metrics
        metrics = calculate_metrics(all_files)
        
        # 4. Extract API Endpoints
        api_endpoints = extract_api_endpoints(all_files)
        
        # 5. Detect Missing Documentation
        missing_docs = detect_missing_documentation(all_files)
        
        # 6. Select Top Files for AI Analysis
        top_files = get_top_files(all_files, limit=10)
        
        # 7. Generate AI Content using Watsonx
        tests_content = generate_tests(top_files, language, framework)
        docs_content = generate_docs(top_files, api_endpoints, framework)
        explanation_content = explain_code(top_files, language, framework)
        
        # 8. Calculate AI confidence and generate architecture insights
        ai_confidence = calculate_ai_confidence(top_files, metrics)
        architecture_summary = generate_architecture_summary(all_files, language, framework)
        architecture_flow = generate_architecture_flow(all_files, framework)
        
        # 9. Generate Project Overview
        overview = generate_project_overview(all_files, language, framework, metrics)
        
        # 10. Update Database Record with Rich Data
        analysis.status = "completed"
        analysis.tests_generated = len(top_files) * 5  # More realistic estimate
        analysis.api_endpoints = len(api_endpoints)
        analysis.coverage = metrics['estimated_coverage']
        analysis.analyzed_at = datetime.utcnow().isoformat() + "Z"
        analysis.language = language
        analysis.framework = framework
        analysis.lines_of_code = metrics['total_lines']
        analysis.ai_confidence = ai_confidence
        
        analysis.results = {
            "overview": overview,
            "tests": tests_content,
            "docs": docs_content,
            "explanation": explanation_content,
            "files_analyzed": [f["path"] for f in top_files],
            "api_endpoints": api_endpoints,
            "missing_documentation": missing_docs,
            "metrics": metrics,
            "language": language,
            "framework": framework,
            "ai_confidence": ai_confidence,
            "architecture_summary": architecture_summary,
            "architecture_flow": architecture_flow
        }
        save_analysis(analysis)
        
    except Exception as e:
        print(f"Analysis error: {e}")
        analysis.status = "failed"
        analysis.error = str(e)
        analysis.analyzed_at = datetime.utcnow().isoformat() + "Z"
        save_analysis(analysis)

def generate_project_overview(files, language, framework, metrics):
    """Generate a high-level project overview with intelligence."""
    
    # Generate intelligent summaries
    structure_summary = generate_repository_structure_summary(files)
    architecture_summary = generate_architecture_summary(files, language, framework)
    architecture_flow = generate_architecture_flow(files, framework)
    ai_confidence = calculate_ai_confidence(files, metrics)
    
    # Build technology badges
    tech_badges = [language]
    if framework != "Unknown":
        frameworks = framework.split(', ')
        tech_badges.extend(frameworks)
    
    badges_line = " • ".join(tech_badges)
    
    overview = f"""# 🎯 Project Overview

## 🏷️ Technology Stack
**{badges_line}**

## 📊 Repository Metrics
| Metric | Value |
|--------|-------|
| **Total Files Analyzed** | {metrics['total_files']} |
| **Lines of Code** | {metrics['total_lines']:,} |
| **Test Files** | {metrics['test_files']} |
| **Estimated Coverage** | {metrics['estimated_coverage']}% |
| **AI Confidence** | {ai_confidence}% |

## 🏗️ Architecture Summary
{architecture_summary}

## 🔄 Architecture Flow
```
{architecture_flow}
```

## 📁 Repository Structure
{structure_summary}

## 🤖 AI Analysis
BobCat has performed deep analysis on this repository using IBM watsonx.ai and Granite foundation models.
The analysis includes automated test generation, API documentation, code explanations, and architectural insights.

**Analysis Confidence:** {ai_confidence}% - Based on code quality, structure, and completeness of the repository.
"""
    return overview

@router.post("/analyze")
async def analyze_repo(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    """Start repository analysis."""
    result_id = str(uuid.uuid4())
    
    # Extract repo name from URL
    repo_name = str(req.url).rstrip('/').split('/')[-1]
    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]
    
    # Initialize record
    initial_analysis = AnalyzeResponse(
        id=result_id,
        name=repo_name,
        url=str(req.url),
        status="processing"
    )
    save_analysis(initial_analysis)
    
    # Add to background tasks
    background_tasks.add_task(run_analysis, result_id, req)
    
    return {"id": result_id, "status": "processing"}

# Made with Bob
