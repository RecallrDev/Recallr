from pydantic import BaseModel, Field
from typing import Optional, Union
from datetime import datetime

class CardBase(BaseModel):
    id: Optional[Union[str, int]] = None  # Accept both string and int
    created_at: Optional[datetime] = None
    deck_id: Optional[Union[str, int]] = None
    user_id: Optional[str] = None

    class Config:
        from_attributes = True

class BasicCard(CardBase):
    front: str
    back: str
    type: str = "basic"

class MCChoice(BaseModel):
    id: Optional[Union[str, int]] = None  # Accept both string and int
    answer_text: str
    is_correct: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MCCard(CardBase):
    question: str
    choices: list[MCChoice] = []
    type: str = "multiple_choice"

class CardCreate(BaseModel):
    deck_id: Union[str, int]
    type: str
    front: Optional[str] = None
    back: Optional[str] = None
    question: Optional[str] = None
    choices: Optional[list[MCChoice]] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True