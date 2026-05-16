from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    url: HttpUrl

class AnalyzeResponse(BaseModel):
    id: str
    url: str
    status: str  # e.g., 'processing', 'completed', 'failed'
    tests_generated: Optional[int] = 0
    api_endpoints: Optional[int] = 0
    coverage: Optional[int] = 0
    analyzed_at: Optional[str] = None
    results: Optional[Dict[str, Any]] = None  # To hold the actual generated content
    error: Optional[str] = None

class HistoryResponse(BaseModel):
    repositories: List[AnalyzeResponse]
