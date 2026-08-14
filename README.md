# HireLens

AI-powered resume analyser that scores resumes against job descriptions using Google Gemini, with authentication and per-user analysis history.

## Status

Full stack complete — backend API and React frontend, both tested end-to-end.

| Milestone | Description | Status |
|---|---|---|
| 1 | Project skeleton (Express server, env config) | ✅ Done |
| 2 | PostgreSQL schema + connection pool | ✅ Done |
| 3 | Auth (signup/login, JWT, bcrypt) | ✅ Done |
| 4 | PDF upload + text extraction (Multer + pdf-parse) | ✅ Done |
| 5 | Gemini API integration | ✅ Done |
| 6 | Analysis persistence + history endpoints | ✅ Done |
| 7 | Validation, rate limiting, security hardening | ✅ Done |
| 8 | React + Tailwind frontend scaffold, auth flow, routing | ✅ Done |
| 9 | Resume analysis UI (upload, score visualization) | ✅ Done |
| 10 | History list + analysis detail pages | ✅ Done |
| 11 | Responsive navbar, 404 page | ✅ Done |
| 12 | Loading skeletons, final polish | ✅ Done |

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **AI:** Google Gemini API (`gemini-3.5-flash`)
- **Auth:** JWT + bcrypt

## Project Structure

```
HireLens/
├── backend/
│   ├── src/
│   │   ├── config/       # env loading, DB pool, schema, migration script
│   │   ├── controllers/  # request handlers (auth, analysis)
│   │   ├── middleware/   # requireAuth, upload (Multer), authLimiter
│   │   ├── routes/       # route definitions
│   │   ├── utils/        # PDF extraction, Gemini service, response parser
│   │   └── server.js     # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client with auth interceptor
│   │   ├── components/   # Navbar, ScoreRing, ResultListCard, Skeleton, ProtectedRoute
│   │   ├── context/       # AuthContext (login state, JWT persistence)
│   │   ├── pages/         # Landing, Login, Signup, Analyze, History, AnalysisDetail, NotFound
│   │   └── App.jsx        # Route definitions
│   ├── .env.example
│   └── package.json
└── README.md
```

## API Overview

All routes are prefixed with `/api`.

### Auth (`/api/auth`)
| Method | Route | Description |
|---|---|---|
| POST | `/signup` | Create an account, returns a JWT |
| POST | `/login` | Authenticate, returns a JWT |

Both routes are rate-limited (20 requests / 15 min per IP) to prevent brute-force attempts.

### Analyses (`/api/analyses`) — all require `Authorization: Bearer <token>`
| Method | Route | Description |
|---|---|---|
| POST | `/analyze` | Upload a PDF resume + job description, get an AI-scored analysis |
| GET | `/history` | List the logged-in user's past analyses |
| GET | `/:id` | Get full detail for one analysis (only if owned by the requester) |

## Local Setup

Run the backend and frontend in two separate terminals.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # fill in your DB credentials, JWT secret, and Gemini API key
npm run migrate        # creates the users and analyses tables
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /api/health`.

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # points at the backend URL, defaults to localhost:5000
npm run dev
```
Runs on `http://localhost:5173`.

## Design

The UI uses a deliberate "precision instrument" visual language rather than a generic SaaS template: an ink-navy background, a two-accent system (cyan for positive/active states, amber for gaps/attention), Space Grotesk for headings, and IBM Plex Mono for scores and data. A recurring "aperture ring" motif (used in the logo and the match-score visualization) ties back to the product's core idea — bringing a resume into focus against a job description.

## Security Notes

- Passwords are hashed with bcrypt (never stored in plain text)
- JWTs carry only `id` and `email` in the payload — no sensitive data
- `analyses` rows are scoped to `user_id`; requests for another user's analysis return `404`, not `403`, to avoid confirming the ID exists (IDOR protection)
- Auth endpoints are rate-limited against brute-force attacks
- Uploaded PDFs are processed in memory only and never written to disk
- `.env` files (real secrets) are gitignored in both `backend/` and `frontend/`; only `.env.example` templates are committed
