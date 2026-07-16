const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls,deleteUrl } = require('../controllers/urlControllers');
const { verifyUser } = require('../middewares/authMiddleware');

router.post('/shorten', verifyUser, createShortUrl);
router.get('/my-urls', verifyUser, getUserUrls);
router.delete('/delete-url/:id', verifyUser, deleteUrl);

module.exports = router;