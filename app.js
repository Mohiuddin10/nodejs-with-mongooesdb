const express = require("express");
const mongoose = require("mongoose");
const app = express();

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/products');
        console.log("DB is connected successfully");
        
    } catch (error) {
        console.log("DB connection failed");
        console.log(error.message);
    }
}




app.get("/", (req, res) => {
    res.json({
        message: "hello from server"
    })
})

module.exports = {app, connectDb};