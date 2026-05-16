from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeResponse
from db.storage import get_analysis

router = APIRouter()

@router.get("/results/{result_id}", response_model=AnalyzeResponse)
async def get_results(result_id: str):
    analysis = get_analysis(result_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
