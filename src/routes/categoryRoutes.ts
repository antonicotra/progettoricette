import { Router } from 'express';
import { getCategories } from '../controllers/categoryControllers';
import { authenticateToken } from '../middlewares/tokenValidator';

const router = Router();

router.get('/', authenticateToken, getCategories);

export default router;