const pdfParse = require('pdf-parse');

// Takes the raw PDF Buffer (from multer's memoryStorage) and returns
// plain extracted text. Wrapped in a try/catch by the caller since
// pdf-parse throws on corrupted or non-standard PDF structures.
async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);

  // pdf-parse sometimes leaves excessive blank lines / whitespace from
  // page breaks and columns - collapse them so the text we send to Gemini
  // is cleaner and uses fewer tokens.
  const cleanedText = data.text
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleanedText) {
    throw new Error('Could not extract any text from this PDF. It may be a scanned image rather than text-based.');
  }

  return cleanedText;
}

module.exports = extractTextFromPdf;
