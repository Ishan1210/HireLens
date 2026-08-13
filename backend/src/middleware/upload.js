const multer = require('multer');

// We use memory storage (not disk storage) because we only need the file
// briefly to extract its text - we never need to persist the actual PDF
// on our server. The file arrives as a Buffer in req.file.buffer.
const storage = multer.memoryStorage();

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB - resumes are almost never bigger than this

function fileFilter(req, file, cb) {
  const isPdf = file.mimetype === 'application/pdf';
  if (!isPdf) {
    // Passing an Error here (instead of just false) lets us surface a
    // specific message via the error-handling middleware in server.js
    return cb(new Error('Only PDF files are allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

module.exports = upload;
