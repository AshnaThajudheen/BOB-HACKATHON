from fastapi import APIRouter, BackgroundTasks, HTTPException
import uuid
from datetime import datetime
from models.schemas import AnalyzeRequest
from db.storage import save_analysis, get_analysis
from models.schemas import AnalyzeResponse
from services.github_service import fetch_repository_files
from utils.parser import get_top_files
from services.test_generator import generate_tests
from services.doc_generator import generate_docs
from services.explainer import explain_code

router = APIRouter()

def run_analysis(result_id: str, req: AnalyzeRequest):
    # Fetch current record to update it
    analysis = get_analysis(result_id)
    if not analysis:
        return

    try:
        # 1. Fetch Repo Files
        all_files = fetch_repository_files(str(req.url))
        
        # 2. Parse and Select Top Files
        top_files = get_top_files(all_files, limit=5)
        
        # 3. Generate Content using Watsonx
        tests_content = generate_tests(top_files)
        docs_content = generate_docs(top_files)
        explanation_content = explain_code(top_files)
        
        # 4. Update Database Record
        analysis.status = "completed"
        analysis.tests_generated = len(top_files) * 3  # Mock metric
        analysis.api_endpoints = 5  # Mock metric
        analysis.coverage = 85  # Mock metric
        analysis.analyzed_at = datetime.utcnow().isoformat() + "Z"
        
        analysis.results = {
            "tests": tests_content,
            "docs": docs_content,
            "explanation": explanation_content,
            "files_analyzed": [f["path"] for f in top_files]
        }
        save_analysis(analysis)
        
    except Exception as e:
        analysis.status = "failed"
        analysis.error = str(e)
        analysis.analyzed_at = datetime.utcnow().isoformat() + "Z"
        save_analysis(analysis)

@router.post("/analyze")
async def analyze_repo(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    result_id = str(uuid.uuid4())
    
    # Initialize record
    initial_analysis = AnalyzeResponse(
        id=result_id,
        url=str(req.url),
        status="processing"
    )
    save_analysis(initial_analysis)
    
    # Add to background tasks
    background_tasks.add_task(run_analysis, result_id, req)
    
    return {"id": result_id, "status": "processing"}
