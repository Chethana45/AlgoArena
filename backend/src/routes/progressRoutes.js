import { Router } from 'express';
import { addXP, toggleFavorite, recordActivity } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/xp', authMiddleware, addXP);
router.post('/favorite', authMiddleware, toggleFavorite);
router.post('/activity', authMiddleware, recordActivity);

export default router;
