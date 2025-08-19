from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

# Blocklist Schemas
class BlocklistItemCreate(BaseModel):
    website: str

class BlocklistItemResponse(BaseModel):
    id: int
    website: str
    created_at: datetime

    class Config:
        from_attributes = True

class BlocklistResponse(BaseModel):
    websites: List[str]

# Activity Schemas
class ActivityCreate(BaseModel):
    problem_name: str
    problem_url: str
    difficulty: str
    topic_tags: Optional[List[str]] = None
    status: str

class ActivityUpdate(BaseModel):
    problem_name: Optional[str] = None
    problem_url: Optional[str] = None
    difficulty: Optional[str] = None
    topic_tags: Optional[List[str]] = None
    status: Optional[str] = None

class ActivityResponse(BaseModel):
    id: int
    problem_name: str
    problem_url: str
    difficulty: str
    topic_tags: Optional[List[str]] = None
    status: str
    completed_at: datetime

    class Config:
        from_attributes = True

class ActivitiesResponse(BaseModel):
    activities: List[ActivityResponse]
