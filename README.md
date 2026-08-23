# Aarogya Connect — AI Symptom Checker (Telugu / English)

Smart India Hackathon 2026 · Problem Statement SITE-AP-014 — AI Symptom-Checker
Chatbot in Telugu for Rural Andhra Pradesh Healthcare Access.

A MERN app: symptom triage chat (Groq-powered, bilingual), member accounts,
chat history, assessment history, and PHC referral tracking — plus a
floating "Medi AI" launcher available from every page.

## Structure

```
.
├── server.js, controllers/, models/, routes/, services/, middleware/   → Node/Express API
└── frontend/                                                          → React (Vite) app
```

## 1. Backend setup

```bash
npm install
cp .env.example .env   # fill in your own values, see below
npm run dev             # http://localhost:8000
```

Required env vars (`.env`):

| Var | Notes |
|---|---|
| `MONGO_USERNAME` / `MONGO_PASSWORD` / `MONGO_CLUSTER` / `MONGO_DATABASE` | MongoDB Atlas connection |
| `JWT_SECRET` | any long random string |
| `FRONTEND_URL` | your deployed frontend origin(s), comma-separated. Leave blank locally. |
| `AI_API_KEY` | Groq API key — https://console.groq.com/keys |
| `AI_API_URL` | `https://api.groq.com/openai/v1/chat/completions` (Groq is OpenAI-compatible) |
| `AI_MODEL` | e.g. `llama-3.3-70b-versatile` |

If `AI_API_KEY`/`AI_API_URL` are unset, the app **still works** — it falls
back to the built-in rule-based `symptomService`/`triageService` responses
instead of calling an LLM.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL for production builds
npm run dev             # http://localhost:5173, proxies /api to :8000
```

## 3. Deploying

### Backend → Render
1. Push this repo to GitHub.
2. In Render: New → Blueprint, point at the repo — `render.yaml` at the root
   configures the service automatically (or create a Web Service manually
   with build command `npm install`, start command `npm start`).
3. Fill in the Mongo/JWT/AI env vars in the Render dashboard.
4. Once live, copy the Render URL (e.g. `https://arogya-connect-api.onrender.com`).

### Frontend → Vercel
1. Import the repo in Vercel, set **Root Directory** to `frontend`.
2. Set env var `VITE_API_URL` to `<your-render-url>/api`.
3. Deploy. `vercel.json` handles SPA client-side routing.
4. Back in Render, set `FRONTEND_URL` to your Vercel URL (and custom domain,
   if any) so CORS allows it.

## Notes / known limitations

- The rule-based Telugu triage keyword list in `services/triageService.js`
  has a few garbled/mixed-script entries from an earlier auto-translation
  pass — worth a native-speaker review before relying on it as the sole
  safety net (the Groq LLM path is the primary responder when configured).
- No automated tests included.
- The floating widget and full `/chat` page share the backend contract but
  keep separate local message state — the widget doesn't currently show a
  session's full history, only the current tab's conversation.
