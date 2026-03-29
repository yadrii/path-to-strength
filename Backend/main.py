import os
import json
import logging
import random
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from groq import Groq

# --- KEEP YOUR FRIEND'S ORIGINAL ROUTER IMPORTS ---
from speech_to_text import router as stt_router
from chat import router as chat_router
from auth_routes import router as auth_router, init_users_db
from incident_routes import router as incident_router, init_incidents_db

load_dotenv()
init_users_db()
init_incidents_db()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AAFNAI Main API",
    version="1.0.0",
)

# --- FIXED CORS FOR VITE (PORT 8080) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Wide open for hackathon stability
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CHAUTARA DATA MODELS ---
class Pebble(BaseModel):
    content: str = Field(..., max_length=120)
    district: str = "Anonymous"
    stage_month: int = 1

class InteractionRequest(BaseModel):
    content: str
    type: str  # "vent" (original story) or "comment" (support reply)

# --- DATABASE & GROQ SETUP ---
CHAUTARA_DB = "chautari_sanctuary.json"
_groq_client = None


def _get_groq_client() -> Groq:
    global _groq_client
    key = os.environ.get("VITE_GROQ_API_KEY") or os.environ.get("GROQ_API_KEY")
    if not key:
        raise HTTPException(
            status_code=503,
            detail="Set GROQ_API_KEY or VITE_GROQ_API_KEY for moderation features.",
        )
    if _groq_client is None:
        _groq_client = Groq(api_key=key)
    return _groq_client

def get_db():
    if not os.path.exists(CHAUTARA_DB):
        # Initial Seed Data for the Hackathon Demo
        seed = {
            "pebbles": [
                {"id": "p1", "content": "The hearing was moved again. I feel heavy today.", "district": "Kathmandu", "flames": 2, "stage_month": 3},
                {"id": "p2", "content": "I finally found a safe room. It's quiet here.", "district": "Pokhara", "flames": 5, "stage_month": 1}
            ],
            "diyas": [],
            "stories": [
                {"id": "s1", "content": "Month 3: I stopped waiting for his apology. I started waiting for my own peace.", "location": "Butwal", "stage_month": 3, "time_ago": "2 days ago"},
                {"id": "s2", "content": "Month 8: Facing the judge was scary, but the truth was my shield.", "location": "Lalitpur", "stage_month": 8, "time_ago": "5 hours ago"}
            ]
        }
        with open(CHAUTARA_DB, "w", encoding="utf-8") as f:
            json.dump(seed, f, indent=2)
        return seed
    with open(CHAUTARA_DB, "r", encoding="utf-8") as f:
        try: return json.load(f)
        except: return {"pebbles": [], "diyas": [], "stories": []}

def save_db(db):
    with open(CHAUTARA_DB, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

# --- EXISTING HEALTH ROUTES ---
@app.get("/health")
async def health():
    return {"status": "ok", "service": "Main API Running"}

# --- NEW CHAUTARA SANCTUARY ROUTES ---

@app.get("/api/sanctuary/{current_month}")
async def get_sanctuary(current_month: int):
    db = get_db()
    current_time = time.time()
    
    # Filter stories matched to the user's specific legal stage month
    matched_stories = [s for s in db.get("stories", []) if s["stage_month"] == current_month]
    
    return {
        "pebbles": db.get("pebbles", []),
        "diyas_count": len(db.get("diyas", [])),
        "stories": matched_stories
    }

@app.post("/api/pebbles")
async def drop_pebble(pebble: Pebble):
    db = get_db()
    db["pebbles"].append({**pebble.model_dump(), "id": os.urandom(3).hex(), "flames": 0})
    save_db(db)
    return {"status": "Pebble dropped"}

@app.post("/api/chautara/interact")
async def handle_interaction(request: InteractionRequest):
    # RULE: Comments/Support MUST be positive. Negative replies are blocked.
    if request.type == "comment":
        prompt = f"""
        Analyze this support message: "{request.content}".
        If it is negative, hateful, or judgmental, respond 'REJECT'.
        If it is supportive, kind, or empathetic, respond 'PASS'.
        Respond ONLY with one word: 'PASS' or 'REJECT'.
        """
        completion = _get_groq_client().chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        if "REJECT" in completion.choices[0].message.content.upper():
            raise HTTPException(status_code=400, detail="You are spreading hatred, can't send the message.")

    return {"status": "Positive energy shared"}

@app.post("/api/diyas")
async def light_diya():
    db = get_db()
    # Diya entry with timestamp for 24-hour logic
    db["diyas"].append({"id": os.urandom(3).hex(), "expires_at": time.time() + 86400})
    save_db(db)
    return {"status": "Diya lit"}

# --- INCLUDE THE ORIGINAL ROUTERS (STAY SAFE) ---
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(incident_router, prefix="/api", tags=["incidents"])
app.include_router(stt_router, prefix="/stt", tags=["Speech To Text"])
app.include_router(chat_router, prefix="/chat", tags=["Groq AI Chat"])

if __name__ == "__main__":
    import uvicorn
    # Port 5000 is the target for PeerConnect.tsx
    uvicorn.run(app, host="127.0.0.1", port=5000)