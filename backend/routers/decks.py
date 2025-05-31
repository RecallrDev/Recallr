from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.deck import DeckResponse
from services.deck_service import DeckService
from dependencies.auth import get_current_user

router = APIRouter(prefix="/decks", tags=["decks"])

@router.get("", response_model=List[DeckResponse])
async def get_decks(current_user = Depends(get_current_user)):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.get_user_decks(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
