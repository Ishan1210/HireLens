const extractTextFromPdf = require('../utils/extractTextFromPdf');
const { callGemini } = require('../utils/geminiService');
const parseGeminiResponse = require('../utils/parseGeminiResponse');

// Full analysis flow: extract resume text -> call Gemini -> parse its
// response -> return the structured result. Database persistence (saving
// this result against the logged-in user) gets added in Milestone 6.
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

    res.status(200).json({
      filename: req.file.originalname,
      matchScore,
      strengths,
      gaps,
      suggestions,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze };
