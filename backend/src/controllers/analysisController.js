const extractTextFromPdf = require('../utils/extractTextFromPdf');

// Temporary endpoint for Milestone 4 - lets us verify PDF upload + text
// extraction work correctly before wiring in Gemini (Milestone 5) and
// database storage (Milestone 6). This will be folded into the real
// analyze() controller once Gemini is integrated.
async function parseTest(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Attach a PDF under the field name "resume".' });
    }

    const extractedText = await extractTextFromPdf(req.file.buffer);

    res.status(200).json({
      originalFilename: req.file.originalname,
      fileSizeBytes: req.file.size,
      extractedCharacterCount: extractedText.length,
      textPreview: extractedText.slice(0, 500), // just a preview, not the full text, to keep the response readable
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { parseTest };
