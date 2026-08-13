const db = require('../config/db');
const extractTextFromPdf = require('../utils/extractTextFromPdf');
const { callGemini } = require('../utils/geminiService');
const parseGeminiResponse = require('../utils/parseGeminiResponse');

// Full analysis flow: extract resume text -> call Gemini -> parse its
// response -> save the result against the logged-in user -> return it.
async function analyze(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Attach a PDF under the field name "resume".' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'jobDescription is required in the request body.' });
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);
    const rawAiResponse = await callGemini(resumeText, jobDescription);
    const { matchScore, strengths, gaps, suggestions } = parseGeminiResponse(rawAiResponse);

    // req.user.id comes from the requireAuth middleware, which decoded it
    // from the JWT - we never trust a user_id passed in the request body.
    const result = await db.query(
      `INSERT INTO analyses
        (user_id, resume_filename, job_description, match_score, strengths, gaps, suggestions, raw_ai_response)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, resume_filename, match_score, strengths, gaps, suggestions, created_at`,
      [
        req.user.id,
        req.file.originalname,
        jobDescription,
        matchScore,
        strengths,
        gaps,
        suggestions,
        rawAiResponse, // stored as JSONB for debugging/audit - lets us re-inspect exactly what Gemini said without re-calling the API
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Returns all analyses for the logged-in user, most recent first.
// Only returns summary fields (not the full job_description or raw AI
// response) to keep the history list lightweight.
async function getHistory(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, resume_filename, match_score, created_at
       FROM analyses
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Returns full detail for a single analysis - but only if it belongs to
// the logged-in user. This prevents user A from viewing user B's analysis
// just by guessing an ID in the URL (a common vulnerability called IDOR -
// Insecure Direct Object Reference).
async function getAnalysisById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, resume_filename, job_description, match_score, strengths, gaps, suggestions, created_at
       FROM analyses
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze, getHistory, getAnalysisById };
