import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";

import mongoose from "mongoose";
import connectToSocket from "./controllers/socket.Manager.js";

import cors from "cors";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8080))

app.get("/home", (req, res)=>{
    return res.json ({"hello": "world"})
});
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        const mongoDB= await mongoose.connect(process.env.MONGO_URL)
        console.log(`MONGO connected to ${mongoose.connection.name}`)
        server.listen(app.get("port"), () => {
            console.log(`Listing on ${app.get("port")} `)
        });
    }catch(err){
        console.error('error we get', err);
    }
  
   };
start();