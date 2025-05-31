from fastapi import Header, HTTPException, Depends
from typing import Dict, Any
import logging
from config.db import supabase

async def get_current_user(authorization: str = Header(...)) -> Dict[str, Any]:
    try:
        token = authorization.removeprefix("Bearer ").strip()
        if not token:
            raise HTTPException(status_code=401, detail="Missing JWT token")

        response = supabase.auth.get_user(token)
        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return response.user
    except Exception as e:
        logging.error(f"Authentication error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
