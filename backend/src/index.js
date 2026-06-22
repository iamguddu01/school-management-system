import express from "express"
import cors from "cors"
import { handleBetterAuth  } from "./config/auth.js";
import { toNodeHandler } from "better-auth/node"
import authRoutes from "./routes/authRoutes.js"
import schoolRoutes from "./routes/schoolRoutes.js"
import announcementRoutes from "./routes/announcementRoutes.js"
const app = express();
const auth = await handleBetterAuth();
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
app.use("/api/auth/", toNodeHandler(auth));
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/school", schoolRoutes)
app.use("/announcement", announcementRoutes)



app.listen(5000, ()=>{
    console.log("Server running on http://localhost:5000");
});
