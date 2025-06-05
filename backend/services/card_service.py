from models.card import CardCreate
from config.db import supabase
import logging

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
                        "answer_text": choice.answer_text,
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
                        "answer_text": choice["answer_text"],
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
        
    @staticmethod
    async def get_mc_cards_by_deck(deck_id: str, user_id: str):
        """Get all MC cards for a specific deck with their choices"""
        try:
            resp = supabase.table("mc_cards").select("*").eq("deck_id", deck_id).eq("user_id", user_id).execute()
            
            if getattr(resp, "error", None):
                raise Exception(f"Supabase error fetching MC cards: {resp.error}")
            
            mc_cards = resp.data or []

            # Fetch choices for each MC card
            for card in mc_cards:
                choices_resp = supabase.table("mc_choices").select("*").eq("mc_card_id", card["id"]).execute()
                if getattr(choices_resp, "error", None):
                    logging.error(f"Error fetching choices for card {card['id']}: {choices_resp.error}")
                    card["choices"] = []
                    continue

                # Convert types and map fields
                card["choices"] = [
                    {
                        "id": str(choice["id"]),
                        "answer_text": choice["answer_text"],
                        "is_correct": choice["is_correct"],
                        "created_at": choice["created_at"]
                    }
                    for choice in (choices_resp.data or [])
                ]
                
                card["id"] = str(card["id"])
                card["type"] = "multiple_choice"

            return mc_cards
        except Exception as e:
            logging.error(f"Error fetching MC cards for deck {deck_id}: {e}")
            raise Exception(f"Failed to fetch MC cards for deck {deck_id}: {str(e)}")

    @staticmethod
    async def get_basic_cards_by_deck(deck_id: str, user_id: str):
        """Get all basic cards for a specific deck"""
        try:
            resp = supabase.table("basic_cards").select("*").eq("deck_id", deck_id).execute()
            
            if getattr(resp, "error", None):
                raise Exception(f"Supabase error fetching basic cards: {resp.error}")
            
            # Convert IDs to strings and add type
            basic_cards = []
            for card in (resp.data or []):
                card["id"] = str(card["id"])
                card["type"] = "basic"
                basic_cards.append(card)
                
            return basic_cards
        except Exception as e:
            logging.error(f"Error fetching basic cards for deck {deck_id}: {e}")
            raise Exception(f"Failed to fetch basic cards for deck {deck_id}: {str(e)}")