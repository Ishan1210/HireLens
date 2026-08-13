// Wraps all direct communication with the Gemini API. Keeping this in its
// own module means the rest of the app never needs to know about Gemini's
// specific request/response shape - if we ever swap AI providers, this is
// the only file that changes.
const env = require('../config/env');

const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildPrompt(resumeText, jobDescription) {
  // We explicitly instruct the model to return ONLY JSON, with no markdown
  // fences or preamble - this makes parsing the response far more reliable.
  // Real-world models still sometimes wrap output in ```json fences anyway,
  // which is why parseGeminiResponse() below defensively strips them.
  return `You are an expert technical recruiter and resume reviewer. Compare the following resume against the job description and provide a structured evaluation.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Respond with ONLY a raw JSON object (no markdown code fences, no explanation text before or after) in exactly this shape:
{
  "matchScore": <integer 0-100, how well the resume matches the job description>,
  "strengths": [<array of 3-5 short strings, specific things the resume does well for this role>],
  "gaps": [<array of 3-5 short strings, specific missing skills/experience relative to the job description>],
  "suggestions": [<array of 3-5 short strings, concrete actionable improvements to the resume>]
}`;
}

async function callGemini(resumeText, jobDescription) {
  const prompt = buildPrompt(resumeText, jobDescription);

  const response = await fetch(`${GEMINI_API_URL}?key=${env.gemini.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4, // lower temperature = more consistent, less "creative" output - we want reliable scoring, not variety
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // Gemini's response is nested several levels deep - candidates[0] is the
  // first (and in our case, only) generated response option.
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Gemini returned an empty or unexpected response structure.');
  }

  return textOutput;
}

module.exports = { callGemini };
