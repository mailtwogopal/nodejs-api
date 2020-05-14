const path = require('path')
require("dotenv").config({path: path.resolve(__dirname,  '../.env')}) 
var config = {
DATABASE_NAME : process.env.DATABASE_NAME,
COLLECTION_NAME : process.env.COLLECTION_NAME,
CONNECTION_URL : process.env.CONNECTION_URL
}

module.exports = config;