import { Request, Response } from 'express';
import { client } from '../config/database';
import { Recipe } from '../models/Recipe';

const db = client.db(process.env.DB_NAME);
const recipesCollection = db.collection<Recipe>('Recipe');

export const getRecipes = async (req: Request, res: Response) => {
  try {
    let recipes: Recipe[] = []
    if(req.query.categoryMeal) {
      recipes = await recipesCollection.find({categoryMeal: req.query.categoryMeal}).toArray()
    } else {
      recipes = await recipesCollection.find({}).toArray()
    }
    res.status(200).json(recipes);
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Errore nel recupero delle ricette:', errorMessage);
    res.status(500).json({ error: 'Errore nel recupero delle ricette dal database' });
  }
};