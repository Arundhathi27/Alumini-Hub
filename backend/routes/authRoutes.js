const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);

// Test protected route
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
