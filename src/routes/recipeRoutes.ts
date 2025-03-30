import { Router } from 'express';
import { getRecipes } from '../controllers/recipeControllers';
import { recipeValidator } from '../middlewares/recipeValidator';
import { authenticateToken } from '../middlewares/tokenValidator';


const router = Router();

router.get('/', authenticateToken, recipeValidator, getRecipes)

export default router;