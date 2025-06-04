from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.deck import DeckResponse, DeckUpdateResponse, DeckUpdate, FinishedStudyDeckUpdate
from services.deck_service import DeckService
from dependencies.auth import get_current_user

router = APIRouter(prefix="/decks", tags=["decks"])

# Fetch all decks for the current user
@router.get("", response_model=List[DeckResponse])
async def get_decks(current_user: str = Depends(get_current_user)):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.get_user_decks(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update a specific deck
@router.put("/{deck_id}", response_model=DeckUpdateResponse)
async def update_deck(
    deck_id: str,
    payload: DeckUpdate,
    current_user: str = Depends(get_current_user),
):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.update_deck(deck_id, payload, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete a specific deck    
@router.delete("/{deck_id}")
async def delete_deck(
    deck_id: str,
    current_user: str = Depends(get_current_user),
):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.delete_deck(deck_id, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Create a new deck
@router.post("", response_model=DeckResponse)
async def create_deck(
    payload: DeckUpdate,
    current_user: str = Depends(get_current_user),
):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.create_deck(payload, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Update the deck after finishing study
@router.put("/finish/{deck_id}", response_model=DeckUpdateResponse)
async def finish_study_deck(
    deck_id: str,
    payload: FinishedStudyDeckUpdate,
    current_user: str = Depends(get_current_user),
):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        return await DeckService.finish_study_deck(deck_id, payload, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))