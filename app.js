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
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
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
        const { title, price, description, rating } = req.body;
        const newProduct = new Product({
            title,
            price,
            description,
            rating
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

// find with logical operator 
app.get("/products2", async (req, res) => {
    try {
        const price = req.query.price;
        const rating = req.query.rating;
        console.log(price, rating);
        let products;
        if (price && rating) {
            products = await Product.find({ $and: [{ price: { $lt: price } }, { rating: { $gt: rating } }] });
        } else {
            products = await Product.find();
        }


        if (products) {
            res.status(200).send({
                success: true,
                message: "Return Products",
                data: products
            })
        }
        else {
            res.status(404).send({
                success: false,
                message: "no products found"
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ price: 1 });
        if (products) {
            res.status(200).send({
                success: true,
                message: "Return Products",
                data: products
            })
        }
        else {
            res.status(404).send({
                success: false,
                message: "no products found"
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });
        if (product) {
            res.status(200).send({
                success: true,
                message: "Return single product",
                data: product
            })
        }
        else {
            res.status(404).send({
                success: false,
                message: "no product found"
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// delete product 
app.delete("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.deleteOne({ _id: id });
        if (product) {
            res.status(200).send({
                success: true,
                message: "Product Deleted successfully",
                data: product
            })
        } else {
            res.status(404).send({
                success: false,
                message: "Product not found",
                data: product
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "server error"
        })
    }
})

module.exports = { app, connectDb };