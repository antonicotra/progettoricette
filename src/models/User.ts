import mongoose from "mongoose";
import {InferSchemaType} from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    emailActive: {type: Boolean, default: false},
    refreshToken: { type: String }
  })

export const User = mongoose.model("users", userSchema)


export type userType = InferSchemaType<typeof userSchema>