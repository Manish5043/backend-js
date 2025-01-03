//require('dotenv').config({path: './env'})

import dotenv from "dotenv"


// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";
import connectDB from "./Db/index.js";

dotenv.config({
    path: './env'
})


connectDB()










/*
import express from "express";
const app = express()

// datbase connect karte samya humein asyn await or try catch ka use karna chahiye jisse ki koi 
// tarah ki dikkat na aaye



(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("can't communicate");
            throw error
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    


    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
    */