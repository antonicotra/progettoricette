import express from 'express'
import {connectToDatabase, closeDatabase} from './config/database'
import "dotenv/config"
import recipeRoutes from './ruotes/recipeRoutes'
import categoryRoutes from './ruotes/categoryRoutes'

const app = express();
app.use(express.json());

app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);

app.get("/", (req, res) => {
    res.send("Il server Express è attivo!")
})

async function start() {
    try {
        await connectToDatabase()
        app.listen(process.env.PORT, () => {
            console.log("Server in ascolto sulla porta ", process.env.PORT)
        })
    } catch(error) {
        console.log("Impossibile avviare il server a causa di un errore di connessione con MongoDB: ", error instanceof Error ? error.message : error)
    }
}

start();