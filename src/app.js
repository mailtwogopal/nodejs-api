const express = require('express')
const mongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const routes = require('./api-routes/routes')
const port = 4200;
require("dotenv").config({path: __dirname + '/.env'})
const url = process.env.CONNECTION_URL;
const dbname = process.env.DATABASE_NAME;

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.listen(port, () => {
    console.log('app running on port' + port);
    mongoClient.connect(url, {useNewUrlParser : true}, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(dbname);
        collection = database.collection(process.env.COLLECTION_NAME);
        console.log("connection established to " + dbname);
    });
})

app.use('/', routes)