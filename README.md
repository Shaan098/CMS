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

## Contributing

Contributions are welcome. Please follow this workflow to keep changes clean and reviewable.

### 1) Fork and branch

- Fork the repo and clone your fork.
- Create a focused branch per change:
	- `feat/<short-topic>` for features
	- `fix/<short-topic>` for bug fixes
	- `docs/<short-topic>` for documentation updates

### 2) Keep changes scoped

- Make minimal, targeted changes for one issue/feature at a time.
- Avoid mixing refactors with feature work in the same PR.
- Preserve existing code style and file structure.

### 3) Run checks before pushing

From project root, run:

```bash
# backend
cd backend
npm install
node --check src/server.js

# frontend
cd ../frontend
npm install
npm run build
```

### 4) Commit style

Use clear, conventional commit messages:

- `feat: add media file size filter`
- `fix: handle missing auth token in reports page`
- `docs: update backend setup steps`

### 5) Pull request checklist

Include the following in your PR:

- What changed and why
- Screenshots or short video for UI changes
- Steps to test
- Any environment variable or API contract changes

### 6) Security and config

- Never commit secrets (`.env`, tokens, DB credentials).
- Keep `.env.example` updated when adding new environment variables.
- Validate role checks on any new protected endpoint.

### 7) Need help?

If you are unsure about implementation direction, open an issue first with:

- Problem statement
- Proposed approach
- Impacted files/routes/pages
