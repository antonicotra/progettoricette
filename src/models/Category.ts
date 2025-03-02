import mongoose from "mongoose";

const Schema = mongoose.Schema

const categorySchema = new Schema({
  categoryName: {type: String, required: true},
  categoryImage: {type: String, required: true}
})


export const Category = mongoose.model("categories", categorySchema)