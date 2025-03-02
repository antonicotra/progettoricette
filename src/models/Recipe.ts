import mongoose from "mongoose";

const Schema = mongoose.Schema

const recipeSchema = new Schema({
  nameMeal: {type: String, required: true},
  categoryMeal: {type: String, required: true},
  nationMeal: {type: String, required: true},
  instruction: {type: [String], required: true},
  imgMeal: {type: String, required: true}
})


export const Recipe = mongoose.model("recipes", recipeSchema)