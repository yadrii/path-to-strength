# Frontend (Vite + React)

## Prerequisites

- Node.js 18+
- Backend running on **the same URL** as `VITE_API_BASE_URL` (see below)

## Environment

Create `Frontend/.env` (or copy from `.env.example` if present):

```env
# Must match the backend port — default backend is port 5000
VITE_API_BASE_URL=http://127.0.0.1:5000
```

If the backend runs on another host/port, set this to that base URL **without** a trailing `/api`.

## Install & dev server

```bash
cd Frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Login / signup

Auth calls `POST /api/auth/register` and `POST /api/auth/login` on the main API. **The backend must be running** and reachable at `VITE_API_BASE_URL`, or login/signup will fail (network error).

See the repo root or `Backend/README.md` for how to start the API on **port 5000**.
