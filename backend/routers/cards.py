# routers/cards.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from models.card import CardCreate, BasicCard, MCCard
from services.card_service import CardService
from dependencies.auth import get_current_user
from typing import Union, Optional

router = APIRouter(prefix="/cards", tags=["cards"])

from typing import Union

@router.post(
    "",
    response_model=Union[BasicCard, MCCard],
    status_code=status.HTTP_201_CREATED
)
async def create_card(
    payload: CardCreate,
    current_user: str = Depends(get_current_user),
):
    user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']

    if payload.type == "basic":
        created = await CardService.create_basic_card(payload, user_id)
        return BasicCard(**created)

    elif payload.type == "multiple_choice":
        created = await CardService.create_mc_card(payload, user_id)
        return MCCard(**created)

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card type; must be 'basic' or 'multiple_choice'."
        )

@router.get(
    "",
    response_model=dict[str, Union[list[BasicCard], list[MCCard]]],
    status_code=status.HTTP_200_OK
)
async def get_cards(
    deck_id: Optional[str] = Query(None, description="Filter cards by deck ID"),
    current_user: str = Depends(get_current_user),
):
    user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
    
    if deck_id:
        # Get cards for specific deck
        basic_cards = await CardService.get_basic_cards_by_deck(deck_id, user_id)
        mc_cards = await CardService.get_mc_cards_by_deck(deck_id, user_id)
    else:
        # Get all cards for user
        basic_cards = await CardService.get_basic_cards_by_user(user_id)
        mc_cards = await CardService.get_mc_cards_by_user(user_id)
    
    return {
        "basic_cards": basic_cards,
        "mc_cards": mc_cards
    }