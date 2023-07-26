const express = require('express');
const app = express()
require('dotenv').config()
const mongoose = require('mongoose');
const morgan = require('morgan')
const databaseConnection = require('./src/config/connection')
const cors = require('cors')
const helmet = require("helmet")

// set up morgan middleware 
app.use(morgan('dev'))

// set up cors for the HTTP Reguest 
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))

app.use(helmet());
app.use(express.json())
app.use('/api/v1', require('./src/routes/index'))

// test route for checking server is running or not
app.get("/healthCheck", async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.status(200).json({
            status: 'OK',
            data: {
                server_port: process.env.PORT,
                message: 'Database Connected Successfully',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                mongodb_version: (await mongoose.connection.db.command({ serverStatus: 1 })).version,
            }
        });
    } catch (error) {
        res.status(500).json({
            message: `Failed To Connect To The Database: ${error.message}`,
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server Is Running On Port No = ", process.env.PORT)
})
