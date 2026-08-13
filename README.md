# HireLens

AI-powered resume analyser that scores resumes against job descriptions using Google Gemini, with auth and history tracking.

## Status

Backend: complete. Frontend: not yet started.

| Milestone | Description | Status |
|---|---|---|
| 1 | Project skeleton (Express server, env config) | ✅ Done |
| 2 | PostgreSQL schema + connection pool | ✅ Done |
| 3 | Auth (signup/login, JWT, bcrypt) | ✅ Done |
| 4 | PDF upload + text extraction (Multer + pdf-parse) | ✅ Done |
| 5 | Gemini API integration | ✅ Done |
| 6 | Analysis persistence + history endpoints | ✅ Done |
| 7 | Validation, rate limiting, security hardening | ✅ Done |
| 8 | React + Tailwind frontend | ⬜ Not started |

## Tech Stack

- **Frontend:** React, Tailwind CSS (planned)
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

```bash
cd backend
npm install
cp .env.example .env   # then fill in your DB credentials, JWT secret, and Gemini API key
npm run migrate        # creates the users and analyses tables
npm run dev
```

Server runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Security Notes

- Passwords are hashed with bcrypt (never stored in plain text)
- JWTs carry only `id` and `email` in the payload — no sensitive data
- `analyses` rows are scoped to `user_id`; requests for another user's analysis return `404`, not `403`, to avoid confirming the ID exists
- Auth endpoints are rate-limited against brute-force attacks
- Uploaded PDFs are processed in memory only and never written to disk
