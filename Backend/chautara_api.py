import os
import sqlite3
import time
import random
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util

load_dotenv()
app = FastAPI(title="Chautara RAG Sanctuary")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_groq_client = None


def _get_groq() -> Groq | None:
    global _groq_client
    key = os.environ.get("GROQ_API_KEY") or os.environ.get("VITE_GROQ_API_KEY")
    if not key:
        return None
    if _groq_client is None:
        _groq_client = Groq(api_key=key)
    return _groq_client


DB_PATH = "chautara_sanctuary.db"

# Load the RAG Embedding Model (Small & Fast for Hackathons)
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS stories 
        (id TEXT PRIMARY KEY, content TEXT, author TEXT, diyas INTEGER, timestamp REAL, type TEXT)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS comments 
        (id TEXT PRIMARY KEY, story_id TEXT, content TEXT, author TEXT)''')
    conn.commit()
    conn.close()

init_db()

# --- RAG RETRIEVAL ENGINE ---
def get_similar_context(user_text):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM stories ORDER BY timestamp DESC LIMIT 500")
    past_stories = [row[0] for row in cursor.fetchall()]
    conn.close()

    if len(past_stories) < 5:
        return "No specific past context found."

    # Semantic Search
    corpus_embeddings = embedder.encode(past_stories, convert_to_tensor=True)
    query_embedding = embedder.encode(user_text, convert_to_tensor=True)
    hits = util.semantic_search(query_embedding, corpus_embeddings, top_k=2)
    
    # Get the actual text of the most similar stories
    context_matches = [past_stories[hit['corpus_id']] for hit in hits[0]]
    return " | ".join(context_matches)

# --- AUTO-DIYA SIMULATOR ---
async def simulate_diyas():
    while True:
        await asyncio.sleep(2) 
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM stories")
        ids = cursor.fetchall()
        if ids:
            rid = random.choice(ids)[0]
            cursor.execute("UPDATE stories SET diyas = diyas + 1 WHERE id = ?", (rid,))
            conn.commit()
        conn.close()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_diyas())

# --- RAG GENERATION ---
async def generate_nepali_rag_reflections(user_text, story_id):
    # 1. RETRIEVE
    context = get_similar_context(user_text)
    
    # 2. AUGMENT & GENERATE
    prompt = f"""
    SISTER CONTEXT: {context}
    NEW SISTER SAYS: "{user_text}"
    
    TASK: Based on the context above, generate 3 unique anonymous sister responses in NEPALI (Devanagari).
    Show her that others have faced similar situations and overcome them. 
    Format: Separate 3 responses with |
    """
    groq = _get_groq()
    if not groq:
        return
    try:
        completion = groq.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        parts = completion.choices[0].message.content.split("|")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        for content in parts:
            if content.strip():
                cursor.execute("INSERT INTO comments VALUES (?, ?, ?, ?)", 
                               (os.urandom(3).hex(), story_id, content.strip(), f"Sister #{random.randint(100,999)}"))
        conn.commit()
        conn.close()
    except: pass

class PostReq(BaseModel):
    content: str

@app.get("/api/chautara/feed")
async def get_feed():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM stories ORDER BY timestamp DESC")
    stories = [dict(row) for row in cursor.fetchall()]
    for s in stories:
        cursor.execute("SELECT * FROM comments WHERE story_id = ?", (s['id'],))
        s['replies'] = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return stories

@app.post("/api/chautara/post")
async def post_story(req: PostReq):
    sid = os.urandom(4).hex()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO stories VALUES (?, ?, ?, ?, ?, ?)", 
                   (sid, req.content, "Anonymous Sister", 0, time.time(), "pebble"))
    conn.commit()
    conn.close()
    # Trigger RAG Background Task
    asyncio.create_task(generate_nepali_rag_reflections(req.content, sid))
    return {"id": sid}

@app.post("/api/chautara/diya/{story_id}")
async def send_diya(story_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE stories SET diyas = diyas + 1 WHERE id = ?", (story_id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5001)