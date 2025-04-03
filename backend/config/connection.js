const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const URI = process.env.MONGODB_URI
        
        if(!URI) {
            throw new Error('MongoDB URI is not defined in .env file')
        }

        await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1) // Exit process with failure
    }
}


module.exports = connectDB
