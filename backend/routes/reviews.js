const express = require('express');
const router = express.Router({ mergeParams: true });
const { getProductReviews, addReview } = require('../controllers/reviews');
const { protect } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, addReview);

module.exports = router;
