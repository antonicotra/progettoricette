import { MongoClient,ServerApiVersion } from 'mongodb' //MongoClient è la classe principale che consente di creare una connessione al server MongoDB
import "dotenv/config" //Ho importato il file .env dentro il codice

export const client = new MongoClient(process.env.URI!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

export async function connectToDatabase() {
      await client.connect();
      console.log("Connessione a MongoDB riuscita!");
  }

export async function closeDatabase() {
    try {
        await client.close();
        console.log("Connessione a MongoDB terminata!")
    } catch(error) {
        console.log("Errore nella chiusura della connessione a MongoDB: ", error)
    }
}