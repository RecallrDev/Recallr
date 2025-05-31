from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, Header, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List
import logging

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://dev.recallr.eu", "http://recallr.eu"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class Deck(BaseModel):
    id: str
    name: str
    user_id: str
    created_at: str
    last_studied: str | None
    cardCount: int
    color: str
    category: str

async def get_current_user(authorization: str = Header(...)):
    try:
        # Remove "Bearer " prefix if present
        token = authorization.removeprefix("Bearer ").strip()
        if not token:
            raise HTTPException(status_code=401, detail="Missing JWT token")

        # Verify with Supabase
        response = supabase.auth.get_user(token)
        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return response.user
    except Exception as e:
        logging.error(f"Authentication error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")



@app.options("/decks")
async def options_decks():
    return {"message": "OK"}

@app.get("/test-decks")
async def test_decks():
    return [{"id": "test", "name": "Test Deck", "color": "#purple", "card_count": 5}]

@app.get("/decks", response_model=List[Deck])
async def get_decks(current_user = Depends(get_current_user)):
    try:
        user_id = current_user.id if hasattr(current_user, 'id') else current_user['id']
        
        result = supabase.rpc('get_decks_with_counts', {'uid': user_id}).execute()
        
        if not hasattr(result, 'data') or result.data is None:
            return []
        
        decks_with_count = []
        for deck in result.data:
            deck_with_count = {
                "id": str(deck['id']),  # Convert bigint to string
                "name": deck['name'],
                "user_id": str(deck['user_id']),
                "created_at": deck['created_at'],
                "last_studied": deck.get('last_studied'),
                "cardCount": int(deck['cardcount']),
                "color": deck.get('color', ''),
                "category": deck.get('category', '')
            }
            decks_with_count.append(deck_with_count)

        return decks_with_count
    except Exception as e:
        logging.error(f"Error fetching decks: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch decks: {str(e)}")