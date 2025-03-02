import { Request, Response, Router } from 'express';
import { Recipe } from '../models/Recipe';

const router = Router();

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find()
    if(recipes.length == 0) throw new Error('Nessuna ricetta presente')
    res.status(201).json(recipes)
  } catch(err) {
    res.status(404).json(err instanceof Error ? {err: err.message} : {err})
  }
}