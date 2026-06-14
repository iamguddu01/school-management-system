import express from "express"
import { handleMongoDbConnection } from "./config/index.js";
const app = express();

handleMongoDbConnection();

app.listen(5000, ()=>{
    console.log("Server running on http://localhost:5000");
})