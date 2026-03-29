# Backend (FastAPI)

## Setup

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Optional: copy `.env` and set `JWT_SECRET`, `GROQ_API_KEY`, etc.

## Run the API (required for login/signup)

The frontend expects the API at **`http://127.0.0.1:5000`** by default (`VITE_API_BASE_URL`).

**Option A — recommended (matches frontend default):**

```bash
cd Backend
source venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 5000
```

**Option B:**

```bash
python main.py
```

(This also binds to port **5000**.)

> **Do not** use `uvicorn main:app --reload` without `--port 5000` — the default is **8000**, and the app will not match the frontend unless you set `VITE_API_BASE_URL=http://127.0.0.1:8000`.

## Check it’s up

- Open `http://127.0.0.1:5000/docs` — Swagger UI should load.
- Register/login from the frontend should hit `http://127.0.0.1:5000/api/auth/register` and `/api/auth/login`.

## Auth database

Users are stored in `Backend/sangai_users.db` (SQLite), created on first run. If you have an older `sahara_users.db` file from a previous name, rename it to `sangai_users.db` to keep existing accounts.
