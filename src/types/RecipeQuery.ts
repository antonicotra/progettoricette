import { recipeType } from "../Recipe";


export type Query = Pick<recipeType, "nameMeal" | "categoryMeal">