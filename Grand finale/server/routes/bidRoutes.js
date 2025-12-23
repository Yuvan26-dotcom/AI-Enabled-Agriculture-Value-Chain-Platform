const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBid, getBids, getMyBids } = require('../controllers/bidController');

// Public/Shared routes
router.get('/', getBids);

// Protected routes
router.post('/', auth, createBid);
router.get('/my-bids', auth, getMyBids);

module.exports = router;
