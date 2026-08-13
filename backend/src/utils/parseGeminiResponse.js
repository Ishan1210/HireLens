// Gemini is instructed to return raw JSON, but in practice it sometimes
// wraps the response in markdown code fences (```json ... ```) or adds
// stray whitespace/newlines around it. This function defensively strips
// that formatting before parsing, and validates the resulting shape so a
// malformed AI response fails with a clear error instead of corrupting
// data saved to the database.
function parseGeminiResponse(rawText) {
  let cleaned = rawText.trim();

  // Strip ```json ... ``` or plain ``` ... ``` fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON. The model may have returned malformed output.');
  }

  const { matchScore, strengths, gaps, suggestions } = parsed;

  const isValid =
    typeof matchScore === 'number' &&
    matchScore >= 0 &&
    matchScore <= 100 &&
    Array.isArray(strengths) &&
    Array.isArray(gaps) &&
    Array.isArray(suggestions);

  if (!isValid) {
    throw new Error('AI response was valid JSON but did not match the expected shape.');
  }

  return { matchScore, strengths, gaps, suggestions };
}

module.exports = parseGeminiResponse;
