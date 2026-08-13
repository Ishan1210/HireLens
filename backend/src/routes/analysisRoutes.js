const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const { analyze, getHistory, getAnalysisById } = require('../controllers/analysisController');

// upload.single('resume') expects the file to be sent under the field name "resume"
// in a multipart/form-data request, alongside a "jobDescription" text field.
// All routes below are protected by requireAuth - only logged-in users can hit these.
router.post('/analyze', requireAuth, upload.single('resume'), analyze);
router.get('/history', requireAuth, getHistory);
router.get('/:id', requireAuth, getAnalysisById);

module.exports = router;
