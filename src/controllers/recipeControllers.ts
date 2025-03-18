import { NextFunction, Request, Response } from 'express';
import { query, ValidationChain, validationResult} from 'express-validator';

export const getRecipes = async (req: Request, res: Response, next: NextFunction) => {

  const middleware: ValidationChain[] = [
    query('page')
    .default(0)
    .isInt({ min: 0 })
    .withMessage('Page must be a non-negative integer'),

    query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string')
    .trim(),

    query('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .trim()
  ]

  await Promise.all(middleware.map(mid => mid.run(req)))

  const errors = validationResult(req)

  if(!errors.isEmpty()) res.status(400).json(errors.array().map(err => ({message: err.msg})))
  else next()
}