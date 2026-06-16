import { configDotenv } from "dotenv"
configDotenv()
import { MongoClient } from "mongodb";
import mongoose from "mongoose"


const MONGO_URI = process.env.MONGO_URI
let cachedConnection = null

export const handleMongoDbConnection = async()=>{
    try {
        if(cachedConnection){
            return cachedConnection;
        }
        await mongoose.connect(MONGO_URI)
        const client = new MongoClient(MONGO_URI)
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        console.log("DB connected");
        cachedConnection = {client, db}
        return cachedConnection;
    } catch (error) {
        console.log("DB connection failed, error ==> ", error);
    }
}