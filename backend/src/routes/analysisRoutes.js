const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const { analyze } = require('../controllers/analysisController');

// upload.single('resume') expects the file to be sent under the field name "resume"
// in a multipart/form-data request, alongside a "jobDescription" text field.
// Protected by requireAuth - only logged-in users can hit this.
router.post('/analyze', requireAuth, upload.single('resume'), analyze);

module.exports = router;
