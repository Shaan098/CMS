# CMS from Scratch (MERN)

Freshly rebuilt CMS project with:

- Backend: Express + MongoDB + JWT auth + role-based access
- Frontend: React + Vite
- Features: users, roles, media upload metadata, approvals, reports, settings

## Quick Start

### 1) Backend

```bash
cd backend
npm install
# Windows PowerShell
Copy-Item .env.example .env
# macOS/Linux
# cp .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Default backend URL: `http://localhost:5000`
Default frontend URL: `http://localhost:5173`

## Backend env checks

On startup, backend validates:

- `.env` is present and loadable
- `MONGO_URI` exists
- `JWT_SECRET` exists

If startup fails, copy `.env.example` to `.env`, fill values, and restart.
