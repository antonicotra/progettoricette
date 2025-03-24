import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import recipeRoutes from './routes/recipeRoutes'
import categoryRoutes from './routes/categoryRoutes'

const app = express();


app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);


app.listen(3000, async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/recipedb");
        console.log("Il database è connesso!");
    } catch(err) {
        console.log(err)
    }
}); 