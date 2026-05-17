from pydantic import BaseModel, HttpUrl, field_validator
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    url: str
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        if not v.startswith('http'):
            raise ValueError('URL must start with http or https')
        return v

class AnalyzeResponse(BaseModel):
    id: str
    url: str
    name: Optional[str] = None
    status: str  # e.g., 'processing', 'completed', 'failed'
    tests_generated: Optional[int] = 0
    api_endpoints: Optional[int] = 0
    coverage: Optional[float] = 0
    analyzed_at: Optional[str] = None
    language: Optional[str] = None
    framework: Optional[str] = None
    lines_of_code: Optional[int] = 0
    ai_confidence: Optional[int] = 85
    results: Optional[Dict[str, Any]] = None  # To hold the actual generated content
    error: Optional[str] = None

class HistoryResponse(BaseModel):
    repositories: List[AnalyzeResponse]
