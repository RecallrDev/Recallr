from typing import List
from models.deck import DeckResponse
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
