from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routers import decks

app = FastAPI(title="Recallr API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(decks.router)

@app.get("/")
async def root():
    return {"message": "Recallr API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
