import express from 'express';
import { getRecommendations, getPersonalRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/personal').get(protect, getPersonalRecommendations);
router.route('/:productId').get(getRecommendations);

export default router;
