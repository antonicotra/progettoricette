import { Request, Response } from 'express';
import { client } from '../config/database';
import { Category } from '../models/Category';

const db = client.db(process.env.DB_NAME);
const categoriesCollection = db.collection<Category>('Categories');

export const getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await categoriesCollection.find({}).toArray();
      res.status(200).json(categories);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Errore nel recupero delle categorie:', errorMessage);
      res.status(500).json({ error: 'Errore nel recupero delle categorie dal database'});
    }
  };