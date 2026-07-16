const express = require('express');
const router = express.Router();
const { signupUser,loginUser } = require('../controllers/userController');
const { verifyUser } = require('../middewares/authMiddleware');


router.post('/signup', signupUser);
router.post('/loginUser', loginUser);

router.get('/homeData', verifyUser, (req, res) => {
    res.status(200).json({ success: true, message: "" });
});


module.exports = router;