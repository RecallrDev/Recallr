from typing import List
from models.deck import DeckResponse, DeckUpdate, DeckUpdateResponse, DeckCreate
from config.db import supabase
import logging
import datetime

class DeckService:

    # Get all decks for a user
    @staticmethod
    async def get_user_decks(user_id: str) -> List[DeckResponse]:
        try:
            result = supabase.rpc('get_decks_with_counts', {'uid': user_id}).execute()
            
            if not hasattr(result, 'data') or result.data is None:
                return []
            
            return [
                DeckResponse(
                    id=str(deck['id']),
                    name=deck['name'],
                    user_id=str(deck['user_id']),
                    created_at=deck['created_at'],
                    last_studied=deck.get('last_studied'),
                    cardCount=int(deck['cardcount']),
                    color=deck.get('color', ''),
                    category=deck.get('category', '')
                )
                for deck in result.data
            ]
        except Exception as e:
            logging.error(f"Error fetching decks: {e}")
            raise Exception(f"Failed to fetch decks: {str(e)}")

    # Update a specific deck
    @staticmethod
    async def update_deck(deck_id: str, payload: DeckUpdate, current_user_id: str) -> DeckUpdateResponse:
        # 1) Fetch & check ownership (same as before) …
        fetch = supabase.table("decks").select("user_id").eq("id", deck_id).single().execute()
        if not fetch.data:
            raise Exception("Deck not found")
        if fetch.data["user_id"] != current_user_id:
            raise Exception("Not authorized to edit this deck")

        # 2) Build update dict
        update_dict = {}
        if payload.name is not None:
            update_dict["name"] = payload.name.strip()
        if payload.category is not None:
            update_dict["category"] = payload.category
        if payload.color is not None:
            update_dict["color"] = payload.color

        # 3) Update and select exactly those columns
        resp = supabase.table("decks")\
            .update(update_dict)\
            .eq("id", deck_id)\
            .execute()

        row = resp.data[0]
        return DeckUpdateResponse(
            id=str(row["id"]),
            name=row["name"],
            category=row.get("category"),
            color=row.get("color"),
            last_studied=row.get("last_studied"),
            user_id=row["user_id"],
        )
    
    # Delete a specific deck
    @staticmethod
    async def delete_deck(deck_id: str, current_user_id: str):
        # 1) Fetch & check ownership
        fetch = supabase.table("decks").select("user_id").eq("id", deck_id).single().execute()
        if not fetch.data:
            raise Exception("Deck not found")
        if fetch.data["user_id"] != current_user_id:
            raise Exception("Not authorized to delete this deck")

        # 2) Delete the deck
        resp = supabase.table("decks").delete().eq("id", deck_id).execute()

        if not resp.data:
            raise Exception("Failed to delete deck")

        return {"message": "Deck deleted successfully"}

    # Create a new deck
    @staticmethod
    async def create_deck(payload: DeckCreate, current_user_id: str) -> DeckResponse:
        try:
            # Create the deck
            resp = supabase.table("decks").insert({
                "name": payload.name,
                "color": payload.color,
                "category": payload.category,
                "user_id": current_user_id,
                "last_studied": None,
                "created_at": datetime.datetime.now().isoformat()
            }).execute()

            if not resp.data:
                raise Exception("Failed to create deck")

            return DeckResponse(
                id=str(resp.data[0]["id"]),
                name=resp.data[0]["name"],
                color=resp.data[0]["color"],
                category=resp.data[0]["category"],
                user_id=current_user_id,
                created_at=resp.data[0]["created_at"],
                last_studied=resp.data[0].get("last_studied"),
                cardCount=0
            )
        except Exception as e:
            logging.error(f"Error creating deck: {e}")
            raise Exception(f"Failed to create deck: {str(e)}")