from pydantic import BaseModel
from typing import Optional, ClassVar
from datetime import datetime

class CardBase(BaseModel):
    type: ClassVar[str] = "base"

    class Config:
        from_attributes = True

class BasicCard(CardBase):
    front: str
    back: str
    type: ClassVar[str] = "basic"

class MCChoice(BaseModel):
    text: str
    is_correct: bool
    created_at: Optional[datetime] = None

class MCCard(CardBase):
    question: str
    choices: list[MCChoice]
    type: ClassVar[str] = "multiple_choice"
    user_id: Optional[str] = None

class CardCreate(BaseModel):
    deck_id: str
    type: str
    front: Optional[str] = None
    back: Optional[str] = None
    question: Optional[str] = None
    choices: Optional[list[MCChoice]] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True
