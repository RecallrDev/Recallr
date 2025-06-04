from typing import List
from models.deck import DeckResponse, DeckUpdate, DeckUpdateResponse
from config.db import supabase
import logging

class DeckService:
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
