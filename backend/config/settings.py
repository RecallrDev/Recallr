from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    allowed_origins: List[str] = ["http://localhost:5173", "http://dev.recallr.eu", "http://recallr.eu"]
    
    supabase_service_role_key = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY")
    supabase_url = os.getenv("VITE_SUPABASE_URL")

settings = Settings()
