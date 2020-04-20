const express = require('express')
const mongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const routes = require('./routes')
require("dotenv").config()
const CONNECTION_URL = process.env.CONNECTION_URL;
DATABASE_NAME = process.env.DATABASE_NAME;

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.listen(4000, () => {
    mongoClient.connect(CONNECTION_URL, {useNewUrlParser : true}, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection(process.env.COLLECTION_NAME);
        console.log("connection established to " + DATABASE_NAME);
    });
})

app.use('/', routes)