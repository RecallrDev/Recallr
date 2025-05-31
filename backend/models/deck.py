from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeckBase(BaseModel):
    name: str
    color: str = ""
    category: str = ""

class DeckCreate(DeckBase):
    pass

class DeckUpdate(BaseModel):
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
