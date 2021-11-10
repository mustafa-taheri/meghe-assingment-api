require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoUrl = process.env.DB_URL

console.log('Welcome to Assignment Task')

const authRoutes = require('./Routes/AuthRoutes')
const userRoutes = require('./Routes/UserRoutes')


const corsMiddleware = require('./Middleware/CORSMiddleware')
const jwtMiddleware = require('./Middleware/ValidateJWTToken')

app.use(express.json({ limit: '10MB' }))

app.use('/', corsMiddleware);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Token Based Request
app.use('/', jwtMiddleware.verifyJWT);

app.use('/', (error, req, res, next) => {
    console.log(error);
    res.status(error.statusCode || 500);
    res.json({ message: error.message || "Server Error Occurred" });
})

mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true }).then((result) => {
    console.log("Connected to the db");
    app.listen(5001, () => {
        console.log("Server Started at port 5001");
    })
}).catch(err => {
    console.log(err);
    console.log("Unable to connect to DB");
})