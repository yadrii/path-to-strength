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

# Load environment variables
load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="AAFNAI Main API",
    version="1.0.0",
)

# --- FIXED CORS FOR VITE (PORT 8080) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Wide open for hackathon stability
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
    type: str  # "vent" or "comment"


# --- DATABASE & GROQ SETUP ---
CHAUTARA_DB = "chautari_sanctuary.json"
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def get_db():
    if not os.path.exists(CHAUTARA_DB):
        # Initial Seed Data for the Hackathon Demo
        seed = {
            "pebbles": [
                {
                    "id": "p1",
                    "content": "The hearing was moved again. I feel heavy today.",
                    "district": "Kathmandu",
                    "flames": 2,
                    "stage_month": 3,
                },
                {
                    "id": "p2",
                    "content": "I finally found a safe room. It's quiet here.",
                    "district": "Pokhara",
                    "flames": 5,
                    "stage_month": 1,
                },
            ],
            "diyas": [],
            "stories": [
                {
                    "id": "s1",
                    "content": "Month 3: I stopped waiting for his apology. I started waiting for my own peace.",
                    "location": "Butwal",
                    "stage_month": 3,
                    "time_ago": "2 days ago",
                },
                {
                    "id": "s2",
                    "content": "Month 8: Facing the judge was scary, but the truth was my shield.",
                    "location": "Lalitpur",
                    "stage_month": 8,
                    "time_ago": "5 hours ago",
                },
            ],
        }

        with open(CHAUTARA_DB, "w", encoding="utf-8") as f:
            json.dump(seed, f, indent=2)

        return seed

    with open(CHAUTARA_DB, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return {"pebbles": [], "diyas": [], "stories": []}


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

    # Filter stories matched to user's legal stage
    matched_stories = [
        s for s in db.get("stories", [])
        if s["stage_month"] == current_month
    ]

    return {
        "pebbles": db.get("pebbles", []),
        "diyas_count": len(db.get("diyas", [])),
        "stories": matched_stories,
    }


@app.post("/api/pebbles")
async def drop_pebble(pebble: Pebble):
    db = get_db()

    db["pebbles"].append({
        **pebble.model_dump(),
        "id": os.urandom(3).hex(),
        "flames": 0,
    })

    save_db(db)
    return {"status": "Pebble dropped"}


@app.post("/api/chautara/interact")
async def handle_interaction(request: InteractionRequest):
    # RULE: Comments must be positive
    if request.type == "comment":
        prompt = f"""
Analyze this support message: "{request.content}".

If it is negative, hateful, or judgmental → respond 'REJECT'.
If it is supportive, kind, or empathetic → respond 'PASS'.

Respond ONLY with one word: PASS or REJECT.
"""

        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )

        if "REJECT" in completion.choices[0].message.content.upper():
            raise HTTPException(
                status_code=400,
                detail="You are spreading hatred, can't send the message."
            )

    return {"status": "Positive energy shared"}


@app.post("/api/diyas")
async def light_diya():
    db = get_db()

    db["diyas"].append({
        "id": os.urandom(3).hex(),
        "expires_at": time.time() + 86400  # 24 hours
    })

    save_db(db)
    return {"status": "Diya lit"}

# ===== AI LEGAL ASSISTANT ROUTE (ADD BELOW YOUR EXISTING CODE) =====

# ===== AI LEGAL ASSISTANT ROUTE (FIXED) =====

from pydantic import BaseModel
import os, json
from dotenv import load_dotenv
from groq import Groq

# ✅ IMPORTANT CHANGE HERE
from rag import load_pdfs, build_db, handle_query

load_dotenv()

# 🔹 Init once
try:
    load_pdfs()
    build_db()
except:
    pass

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 🔹 Load offline fallback
with open("local_data.json") as f:
    local_data = json.load(f)

class ChatRequest(BaseModel):
    query: str

def search_local(query):
    for key in local_data:
        if key in query.lower():
            return local_data[key]
    return "Hi! I'm here to help you understand your Right to Mental Healthcare. You can ask things like: What does this right include? Who can access mental healthcare? What are my legal protections?"

@app.post("/api/legal-chat")
async def legal_chat(req: ChatRequest):
    query = req.query

    try:
        # ✅ USE NEW RAG PIPELINE
        result = handle_query(query)

        # ✅ If RAG found documents → enhance with LLM
        if result["sources"]:
            context = result["answer"]

            prompt = f"""
You are a Nepal Legal AI Assistant.

STRICT RULES:
- Always mention ACT name
- Mention SECTION number if available
- Give step-by-step actions
- If crime involved → explain FIR process
- If user asks → generate FIR format

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

        # ✅ If NO docs → proper fallback (FIXED)
        else:
            return {
                "reply": result["answer"],
                "sources": [],
                "offline": True
            }

    except Exception as e:
        print("ERROR:", e)
        return {
            "reply": search_local(query),
            "offline": True
        }

# --- INCLUDE ORIGINAL ROUTERS ---
app.include_router(stt_router, prefix="/stt", tags=["Speech To Text"])
app.include_router(chat_router, prefix="/chat", tags=["Groq AI Chat"])


# --- RUN SERVER ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)