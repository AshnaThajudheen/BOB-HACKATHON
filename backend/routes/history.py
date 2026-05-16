from fastapi import APIRouter
from models.schemas import HistoryResponse
from db.storage import get_all_analyses

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
async def get_history():
    analyses = get_all_analyses()
    return HistoryResponse(repositories=analyses)
