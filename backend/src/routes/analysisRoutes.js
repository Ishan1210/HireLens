const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const { parseTest } = require('../controllers/analysisController');

// upload.single('resume') expects the file to be sent under the field name "resume"
// in a multipart/form-data request. Protected by requireAuth - only logged-in
// users can hit this.
router.post('/parse-test', requireAuth, upload.single('resume'), parseTest);

module.exports = router;
