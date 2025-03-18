import { Request, Response, Router } from 'express';
import { Recipe } from '../models/Recipe';

export const getRecipes = async (req: Request, res: Response) => {
  const { page = '0', category, name } = req.query;
  const recipesPerPage = 3
  try {
    let query = {}

    if(category) query = {categoryMeal: category}
    if(name) query = {nameMeal: name}
    const recipes = await Recipe.find(query).skip(Number(page) * recipesPerPage).limit(recipesPerPage)
    res.status(201).json(recipes)
  } catch(err) {
    res.status(404).json(err instanceof Error ? {err: err.message} : {err})
  }
}