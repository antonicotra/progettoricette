import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import recipeRoutes from './ruotes/recipeRoutes'
import categoryRoutes from './ruotes/categoryRoutes'

const app = express();


app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);


app.listen(3000, async () => {
    console.log("Server in esecuzione...");
    await mongoose.connect("mongodb://localhost:27017/recipedb");
    console.log("Il database è connesso!");
}); 