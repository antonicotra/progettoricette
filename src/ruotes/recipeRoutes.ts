import { Router } from 'express';
import { getRecipes } from '../controllers/recipeControllers';

const router = Router();

router.get('/', getRecipes);

export default router;