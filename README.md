# Aarogya AI — Medical Assistant

A Generative AI-powered medical assistant that helps users understand general health
information using Google Gemini. Built with **React (Vite) + Tailwind CSS** on the
frontend and **FastAPI + SQLite** on the backend.

> ⚠️ This app does **not** diagnose diseases. Every AI response includes a disclaimer
> and is for educational purposes only — always consult a qualified healthcare
> professional for medical advice.

## Features

- **User Authentication** — Register, login, logout (JWT-based)
- **AI Symptom Checker** — Describe symptoms in plain language, get possible causes,
  a simple explanation, self-care tips, and whether to see a doctor
- **AI Diet Recommendation** — Enter age, height, weight, gender, diet preference, and
  goal to get a calorie estimate, simple meal plan, water intake target, and lifestyle tips
- **Medicine Reminder** — Add/complete/delete medicine reminders, stored in SQLite
- **AI Health Chatbot** — Ask general wellness questions (session-only chat history)

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 (Vite), Tailwind CSS, React Router, Axios |
| Backend  | Python, FastAPI, SQLAlchemy |
| AI       | Google Gemini API (`gemini-2.0-flash`) |
| Database | SQLite |
| Auth     | JWT (python-jose) + bcrypt password hashing |

## Project Structure

```
medical-ai/
├── backend/
│   ├── routes/          # auth, symptom, diet, reminders, chatbot
│   ├── models/           # SQLAlchemy models + Pydantic schemas
│   ├── database/         # SQLite engine/session setup
│   ├── utils/             # auth (JWT/hashing) + Gemini API wrapper
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/   # Sidebar, DashboardLayout, ProtectedRoute, etc.
│   │   ├── pages/         # Home, Login, Register, Dashboard, SymptomChecker,
│   │   │                  # DietPlanner, MedicineReminder, Chatbot, Profile
│   │   ├── context/       # AuthContext
│   │   └── services/      # api.js (Axios instance + endpoint helpers)
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### 1. Get a free Gemini API key

Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and
create a free API key.

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# then open .env and paste your GEMINI_API_KEY

# Run the server
uvicorn main:app --reload
```

The backend will run at `http://localhost:8000`. Interactive API docs are available at
`http://localhost:8000/docs`. The SQLite database file (`medical_ai.db`) is created
automatically on first run.

### 3. Frontend setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install

# Create your .env file (default already points to localhost:8000)
cp .env.example .env

npm run dev
```

The frontend will run at `http://localhost:5173`.

### 4. Use the app

1. Open `http://localhost:5173` in your browser
2. Click **Get started** to register an account
3. Explore the Symptom Checker, Diet Planner, Medicine Reminder, and Health Chatbot from
   the sidebar

## Notes for Development

- **JWT secret**: The `.env.example` includes a placeholder `JWT_SECRET_KEY`. Generate a
  real one with `python -c "import secrets; print(secrets.token_hex(32))"` before any
  real deployment.
- **CORS**: `CORS_ORIGINS` in `backend/.env` controls which frontend origins may call
  the API. Update it if you deploy the frontend to a different URL.
- **Database resets**: Delete `backend/medical_ai.db` to start with a fresh database
  (all users/reminders will be lost).
- **Gemini model**: The backend uses `gemini-2.0-flash` by default (fast + free-tier
  friendly). You can change this in `backend/utils/gemini.py`.

## Versions Used

- Node.js v24.18.0 / npm v11.16.0 compatible dependency ranges
- Python 3.14 compatible dependency ranges (FastAPI 0.115, SQLAlchemy 2.0,
  google-generativeai 0.8.3)
