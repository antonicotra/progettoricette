import { Request, Response, Router } from 'express';
import { Category } from '../models/Category';

const router = Router();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
    if(categories.length == 0) throw new Error('Nessuna categoria presente')
    res.status(201).json(categories)
  } catch(err) {
    res.status(404).json(err instanceof Error ? {err: err.message} : {err})
  }
}
