const express = require('express')
const mongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const routes = require('./api-routes/routes')
const port = 4200;
var config = require('./config/config')

const dbname = config.DATABASE_NAME;
const url = config.CONNECTION_URL;
const collectionname = config.COLLECTION_NAME;
console.log('env file ' + dbname);
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.listen(port, () => {
    console.log('changes for build testing from jenkins');
    console.log('app running on port' + port);
    mongoClient.connect(url, {useNewUrlParser : true}, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(dbname);
        collection = database.collection(collectionname);
        console.log("connection established to " + dbname);
    });
})

app.use('/', routes)
