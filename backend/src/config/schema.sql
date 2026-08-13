-- HireLens database schema
-- Run this once against your 'hirelens' database (via pgAdmin Query Tool or psql)

-- Stores registered users. Passwords are never stored in plain text --
-- password_hash holds a bcrypt hash generated at signup time.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Stores each resume analysis a user runs. Linked to the user who ran it
-- via a foreign key, so we can fetch "my analysis history".
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_filename VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    match_score INTEGER,
    strengths TEXT[],
    gaps TEXT[],
    suggestions TEXT[],
    raw_ai_response JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index to speed up "get all analyses for this user, most recent first"
-- which is the main query the history endpoint will run.
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
