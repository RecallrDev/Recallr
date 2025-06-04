# routers/cards.py
from fastapi import APIRouter, Depends, HTTPException, status
from models.card import CardCreate, BasicCard, MCCard
from services.card_service import CardService
from dependencies.auth import get_current_user

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

