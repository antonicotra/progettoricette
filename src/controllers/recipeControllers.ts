import {Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { Recipe } from '../models/Recipe';
import { FilterQuery } from 'mongoose';
import { Query } from '../types/RecipeQuery';

export const getRecipes = async (req: Request, res: Response) => {

  const {page,category, name} = matchedData(req)
  let recipesPerPage = page ? 3 : 0

  try {
      let query: FilterQuery<Query> = {}
      if(category) query.categoryMeal = category
      else if(name) query.nameMeal = { $regex: name, $options: 'i' }
      const recipes = await Recipe.find(query).skip(Number(page) * recipesPerPage).limit(recipesPerPage)
      res.status(200).json({accessToken: res.locals.accessToken,recipes})
    } catch(err) {
      res.status(404).json(err instanceof Error ? {err: err.message} : {err})
    }
}