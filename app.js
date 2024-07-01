const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.urlencoded({ extended: true }))

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/products');
        console.log("DB is connected successfully");

    } catch (error) {
        console.log("DB connection failed");
        console.log(error.message);
    }
}

// create schema 
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// create model 
const Product = mongoose.model("product", productSchema)




app.get("/", (req, res) => {
    res.json({
        message: "hello from server"
    })
})

// create operation 
app.post("/products", async (req, res) => {
    try {
        const { title, price, description } = req.body;
        const newProduct = new Product({
            title,
            price,
            description
        })

        await newProduct.save();
        // const productData = await Product.insertMany([
        //     {
        //         title: "samsung galaxy a5",
        //         price: 12000,
        //         description: "a good phone"
        //     },
        //     {
        //         title: "samsung galaxy a7",
        //         price: 13500,
        //         description: "a good phone"
        //     }
        // ]);
        res.status(201).json({
            message: "Product added successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message)
    }
})

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        if (products){
            res.status(200).send(products)
        }
        else {
            res.status(404).send({
                message: "no products found"
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = { app, connectDb };