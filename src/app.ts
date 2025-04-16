import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import recipeRoutes from './routes/recipeRoutes'
import categoryRoutes from './routes/categoryRoutes'
import authRoutes from './routes/authRoutes';
import { ServerApiVersion } from 'mongodb';
import 'dotenv/config'

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
      'https://antun-recipeapp.netlify.app',
      'https://680016c88294d6300ef2dac1--antun-recipeapp.netlify.app'
    ],
    credentials: true
  }));
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);


const URI = process.env.DATABASE_URI as string;
const clientOptions = { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } };

app.listen(3000, async () => {
    try {
        await mongoose.connect(URI, clientOptions);
        console.log("The database is connected!");
    } catch(err) {
        console.log(err)
    }
}); 