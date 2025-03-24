import { Router } from 'express';
import { getRecipes } from '../controllers/recipeControllers';
import { recipeValidator } from '../middlewares/recipeValidator';

const router = Router();

router.get('/', recipeValidator, getRecipes)

export default router;