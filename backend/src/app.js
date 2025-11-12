import express from "express";
import {createServer} from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import connectToSocket from "./controllers/socketManeger.js";

import cors from "cors";


const app = express();

const server = createServer(app);
const io = connectToSocket(server);

app.set ("port", (process.env.PORT || 8080))

// app.get("/home", (req, res)=>{
//     return res.json ({"hello": "world"})
// });
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit : "40kb", extended: true}));

const start = async () =>{
    app.set("mongo_user")
    const connectionDB = await mongoose.connect("mongodb+srv://jinniesaloni_db_user:ooSoTa59kjvYX5RA@cluster0.zbcmiyq.mongodb.net/?appName=Cluster0")
    console.log(`MONGO connected DB on host ${connectionDB.connection.host}`)
    app.listen(app.get("port"), () =>{
        console.log("Listing on port 8080")
    });
}
start();