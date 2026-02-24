# RegIntel – Compliance Intelligence Engine

RegIntel is a predictive regulatory intelligence platform designed to assess audit probability, simulate penalty exposure, and provide compliance risk insights for regulated businesses.

## Core Features (MVP)

- Audit Risk Scoring
- Penalty Simulation Engine
- Regulatory Update Intelligence
- Dispute Draft Assistant
- Industry Benchmarking

## Tech Stack

Frontend: React + Tailwind  
Backend: FastAPI (Python)  
Database: PostgreSQL  
AI Layer: OpenAI (Hybrid Architecture)

## Vision

To become the global regulatory risk intelligence infrastructure layer for SMEs, accounting firms, and regulated enterprises.

Built by practitioners. Designed for regulated industries.
Monorepo structure:
- `backend/` FastAPI API
- `frontend/` React + Vite + Tailwind dashboard
- `docs/` architecture, roadmap, security
- `scripts/` helper scripts

## Quick start

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker compose up --build
```

## Troubleshooting
- Upload field must be named exactly `file` in multipart form.
- If CORS errors occur, adjust `CORS_ORIGINS` in `backend/.env`.
- File size rejected: increase `MAX_UPLOAD_MB`.

## Deployment
- Backend: Render (FastAPI service)
- Frontend: Vercel (Vite static app)

## Bundle
```bash
./scripts/make_zip.sh
```
Creates `regintel_bundle.zip` excluding `node_modules`, `venv`, and `__pycache__`.
