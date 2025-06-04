from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeckBase(BaseModel):
    name: str
    color: str = ""
    category: str = ""

class DeckCreate(DeckBase):
    user_id: str
    last_studied: Optional[datetime] = None

class DeckUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None

class DeckUpdateResponse(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    color: Optional[str] = None
    last_studied: Optional[str] = None
    user_id: str

class FinishedStudyDeckUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    last_studied: Optional[datetime] = None

class DeckResponse(DeckBase):
    id: str
    user_id: str
    created_at: str
    last_studied: Optional[str] = None
    cardCount: int

    class Config:
        from_attributes = True
