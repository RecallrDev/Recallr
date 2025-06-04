from typing import List
from models.card import CardBase, CardCreate, BasicCard, MCCard, MCChoice
from config.db import supabase
import logging
import datetime

class CardService:

    # Create a new basic card
    @staticmethod
    async def create_basic_card(payload: CardCreate, current_user_id: str):
        try:
            resp = supabase.table("basic_cards").insert({
                "deck_id": payload.deck_id,
                "front": payload.front,
                "back": payload.back
            }).execute()

            if getattr(resp, "error", None):
                raise Exception(f"Supabase error on insert: {resp.error}")

            if not resp.data or len(resp.data) == 0:
                raise Exception("Failed to create basic card: no data returned")

            return resp.data[0]

        except Exception as e:
            logging.error(f"Error creating basic card: {e}")
            raise Exception(f"Failed to create basic card: {str(e)}")

    # Create a new multiple choice card
    @staticmethod
    async def create_mc_card(payload: CardCreate, current_user_id: str):
        """
        1) Insert the MC card first (without choices).
        2) Insert MC choices referencing the new card's ID.
        3) Fetch the complete card with choices and return as MCCard.
        """
        try:
            iso_created_at = payload.created_at.isoformat()

            # 1) Insert the MC card first (without choices)
            card_resp = supabase.table("mc_cards").insert({
                "deck_id": payload.deck_id,
                "user_id": current_user_id,
                "question": payload.question,
                "created_at": iso_created_at
            }).execute()

            if getattr(card_resp, "error", None):
                raise Exception(f"Supabase error inserting MC card: {card_resp.error}")
            if not card_resp.data or len(card_resp.data) == 0:
                raise Exception("Failed to create MC card: no data returned")

            # Get the newly created card
            new_card = card_resp.data[0]
            new_card_id = new_card["id"]

            # 2) Insert the MC choices with the card ID reference
            choices_list = []
            if payload.choices:
                choices_data = [
                    {
                        "mc_card_id": new_card_id,
                        "answer_text": choice.text,
                        "is_correct": choice.is_correct,
                        "created_at": iso_created_at
                    }
                    for choice in payload.choices
                ]
                
                choices_resp = supabase.table("mc_choices").insert(choices_data).execute()

                if getattr(choices_resp, "error", None):
                    logging.error(f"Failed to create choices for card {new_card_id}: {choices_resp.error}")
                    raise Exception(f"Supabase error inserting MC choices: {choices_resp.error}")
                
                # Map database fields to Pydantic model fields
                choices_list = [
                    {
                        "id": choice["id"],
                        "text": choice["answer_text"],
                        "is_correct": choice["is_correct"],
                        "created_at": choice["created_at"]
                    }
                    for choice in (choices_resp.data or [])
                ]

            # 3) Combine card data with mapped choices for the MCCard model
            card_with_choices = {
                **new_card,
                "choices": choices_list
            }

            return card_with_choices

        except Exception as e:
            logging.error(f"Error creating mc card: {e}")
            raise Exception(f"Failed to create mc card: {str(e)}")