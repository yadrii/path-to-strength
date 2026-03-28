from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from dotenv import load_dotenv

from speech_to_text import router as stt_router
from chat import router as chat_router

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Main API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="ok",
        service="Main API Running",
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

# Include the Routers
app.include_router(stt_router, prefix="/stt", tags=["Speech To Text"])
app.include_router(chat_router, prefix="/chat", tags=["Groq AI Chat"])
