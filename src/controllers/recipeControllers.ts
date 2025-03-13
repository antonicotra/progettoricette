import { Request, Response, Router } from 'express';
import { Recipe } from '../models/Recipe';

const router = Router();

export const getRecipes = async (req: Request, res: Response) => {
  const { page = '0', category } = req.query;
  const recipesPerPage = 3
  try {
    const query = category ? {categoryMeal: category} : {}
    const recipes = await Recipe.find(query).skip(Number(page) * recipesPerPage).limit(recipesPerPage)
    res.status(201).json(recipes)
  } catch(err) {
    res.status(404).json(err instanceof Error ? {err: err.message} : {err})
  }
}