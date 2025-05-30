from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Recallr API", version="1.0.0")

# CORS für Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://dev.recallr.eu", "http://recallr.eu"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Recallr Backend läuft!", "status": "online"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "1.0.0", "service": "recallr"}

# Beispiel-Route für eure App
@app.get("/api/cards")
async def get_cards():
    return {
        "cards": [
            {"id": 1, "question": "Was ist React?", "answer": "Eine JavaScript-Library"},
            {"id": 2, "question": "Was ist TypeScript?", "answer": "JavaScript mit Typen"}
        ]
    }
