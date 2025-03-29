import { recipeType } from "../models/Recipe";


export type Query = Pick<recipeType, "nameMeal" | "categoryMeal">