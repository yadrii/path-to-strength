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

# Load environment variables
load_dotenv()
init_users_db()
init_incidents_db()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="AAFNAI Main API",
    version="1.0.0",
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class Pebble(BaseModel):
    content: str = Field(..., max_length=120)
    district: str = "Anonymous"
    stage_month: int = 1


class InteractionRequest(BaseModel):
    content: str
    type: str


# --- DB + GROQ ---
CHAUTARA_DB = "chautari_sanctuary.json"
_groq_client = None


def _get_groq_client() -> Groq:
    global _groq_client
    key = os.environ.get("VITE_GROQ_API_KEY") or os.environ.get("GROQ_API_KEY")
    if not key:
        raise HTTPException(status_code=503, detail="Missing GROQ_API_KEY")
    if _groq_client is None:
        _groq_client = Groq(api_key=key)
    return _groq_client


def get_db():
    if not os.path.exists(CHAUTARA_DB):
        seed = {
            "pebbles": [],
            "diyas": [],
            "stories": []
        }
        with open(CHAUTARA_DB, "w", encoding="utf-8") as f:
            json.dump(seed, f, indent=2)
        return seed

    with open(CHAUTARA_DB, "r", encoding="utf-8") as f:
        return json.load(f)


def save_db(db):
    with open(CHAUTARA_DB, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)


# --- ROUTES ---
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chautara/interact")
async def handle_interaction(request: InteractionRequest):

    if request.type == "comment":
        prompt = f"""
Analyze this support message: "{request.content}"

If it is negative, hateful, or judgmental -> respond 'REJECT'.
If it is supportive, kind, or empathetic -> respond 'PASS'.

Respond ONLY with one word.
"""

        completion = _get_groq_client().chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )

        if "REJECT" in completion.choices[0].message.content.upper():
            raise HTTPException(
                status_code=400,
                detail="Only supportive messages allowed"
            )

    return {"status": "Positive energy shared"}


@app.post("/api/diyas")
async def light_diya():
    db = get_db()

    db["diyas"].append({
        "id": os.urandom(3).hex(),
        "expires_at": time.time() + 86400
    })

    save_db(db)
    return {"status": "Diya lit"}


# ===== AI LEGAL ASSISTANT =====

from rag import load_pdfs, build_db, handle_query

try:
    load_pdfs()
    build_db()
except:
    pass

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

with open("local_data.json") as f:
    local_data = json.load(f)


class ChatRequest(BaseModel):
    query: str


def search_local(query):
    for key in local_data:
        if key in query.lower():
            return local_data[key]
    return "I'm here to help you with legal rights."


@app.post("/api/legal-chat")
async def legal_chat(req: ChatRequest):
    query = req.query

    try:
        result = handle_query(query)

        if result["sources"]:
            context = result["answer"]

            prompt = f"""
You are a Nepal Legal AI Assistant.

STRICT RULES:
- Always mention ACT name
- Mention SECTION number if available
- Give step-by-step actions
- If crime involved -> explain FIR process
- If user asks -> generate FIR format

Context:
{context}

User Query:
{query}
"""

            response = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[{"role": "user", "content": prompt}]
            )

            return {
                "reply": response.choices[0].message.content,
                "sources": result["sources"]
            }

        else:
            return {
                "reply": result["answer"],
                "sources": [],
                "offline": True
            }

    except Exception:
        return {
            "reply": search_local(query),
            "offline": True
        }


# --- ROUTERS ---
app.include_router(auth_router, prefix="/api/auth")
app.include_router(incident_router, prefix="/api")
app.include_router(stt_router, prefix="/stt")
app.include_router(chat_router, prefix="/chat")


# --- RUN ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)