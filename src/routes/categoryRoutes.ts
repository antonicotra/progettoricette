import { Router } from 'express';
import { getCategories } from '../controllers/categoryControllers';
import { authenticateToken } from '../middlewares/tokenValidator';
import { isUserVerified } from '../middlewares/isUserVerified';

const router = Router();

router.get('/', authenticateToken, isUserVerified, getCategories);

export default router;