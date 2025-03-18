import { Router } from 'express';
import { getRecipes } from '../controllers/recipeControllers';
import { Request, Response } from 'express';
import {matchedData} from 'express-validator'
import { Recipe } from '../models/Recipe';

const router = Router();

router.get('/', getRecipes, async (req: Request, res: Response) => {

    const {page,category, name} = matchedData(req)
    const RECIPES_PER_PAGE = 3 //INSERIRLO SU ENV?

    try {
        let query: {[key: string]: any} = {}
        if(category) query.categoryMeal = category
        else if(name) query.nameMeal = { $regex: name, $options: 'i' }
        const recipes = await Recipe.find(query).skip(Number(page) * RECIPES_PER_PAGE).limit(RECIPES_PER_PAGE)
        res.status(201).json(recipes)
      } catch(err) {
        res.status(404).json(err instanceof Error ? {err: err.message} : {err})
      }
})

export default router;