import { Request, Response} from 'express';
import { Category } from '../models/Category';


export const getCategories = async (_: Request,res: Response) => {

  
  try {
    const categories = await Category.find()
    if(categories.length == 0) {
      res.status(204).json({msg: "No recipes found"})
      return
    }
    res.status(200).json({accessToken: res.locals.accessToken,categories})
  } catch(err) {
    res.status(500).json(err instanceof Error ? {err: err.message} : {err})
  }
}
