# ◈ NeuralGate — Full-Stack AI Platform

React/Next.js + FastAPI + MongoDB · JWT Auth · End-to-end ML Pipeline

## Prerequisites

| Tool | Install |
|------|---------|
| Python 3.10+ | https://python.org |
| Node.js 18+ | https://nodejs.org |
| MongoDB | `brew install mongodb-community` |

## Quick start

```bash
# 1. Run setup (one time only)
chmod +x setup.sh start.sh
./setup.sh

# 2. Start both servers
./start.sh
```

Then open **http://localhost:3000**

## URLs

| Service | URL |
|---------|-----|
| Landing page (SSG) | http://localhost:3000 |
| Model docs (SSR) | http://localhost:3000/docs |
| Dashboard (CSR) | http://localhost:3000/dashboard |
| FastAPI backend | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

## Architecture — Tier mapping

### Tier A — Frontend (Next.js)
- **SSG**: `/` landing page — `getStaticProps` builds at compile time
- **SSR**: `/docs` — `getServerSideProps` fetches on every request
- **CSR**: `/dashboard` — `useEffect` loads data after JWT auth
- **Charts**: Recharts `BarChart` + confusion matrix on the Metrics page

### Tier B — ML Pipeline (FastAPI)
1. **Data gather** — UCI Iris via sklearn, validated with Pydantic `IrisInput`
2. **Cleaning** — null drop, dedupe, z-score outlier removal (`pipeline.py`)
3. **Feature engineering** — MinMaxScaler, LabelEncoder, derived `petal_ratio`
4. **Model** — RandomForestClassifier, `.pkl` loaded at FastAPI `@startup`
5. **Metrics** — accuracy, precision, recall, F1, confusion matrix → MongoDB

### Tier C — Security (FastAPI)
- `/register` — Argon2id hashing via `pwdlib`
- `/token` — OAuth2 `OAuth2PasswordRequestForm`, issues signed 30-min JWT
- `/predict`, `/metrics` — protected via `Depends(get_current_user)`

## Project structure

```
neuralgate/
├── backend/
│   ├── main.py          # FastAPI app + lifespan model loader
│   ├── auth.py          # /register, /token, JWT utils, Depends guard
│   ├── pipeline.py      # 5-stage ML pipeline
│   ├── models.py        # Pydantic schemas
│   ├── database.py      # MongoDB connection
│   └── requirements.txt
├── frontend/
│   ├── pages/
│   │   ├── index.js     # SSG landing
│   │   ├── docs.js      # SSR model docs
│   │   ├── login.js     # Auth forms
│   │   └── dashboard.js # CSR workspace (inference, metrics, pipeline)
│   ├── styles/globals.css
│   └── package.json
├── setup.sh             # One-time install
└── start.sh             # Start both servers
```

## First login

Register any email/password on the login page, then sign in.
The ML pipeline runs automatically on first startup — no manual step needed.
