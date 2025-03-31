import { Router } from 'express';
import { getRecipes } from '../controllers/recipeControllers';
import { recipeValidator } from '../middlewares/recipeValidator';
import { authenticateToken } from '../middlewares/tokenValidator';
import { isUserVerified } from '../middlewares/isUserVerified';


const router = Router();

router.get('/', authenticateToken, isUserVerified, recipeValidator, getRecipes)

export default router;