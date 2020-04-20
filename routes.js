const express = require('express')
const router = express.Router()
const businessLogic = require('./businesslogic')

//to save users in mongodb
router.post('/users', (request, response) => {
    businessLogic.insertUsers(request, response);
})
//to get all users from db
router.get('/getusers', (request, response) => {
    businessLogic.getAllUsers(request, response);
})
//to get a user by userid
router.get('/getuser/:id', (request, response) => {
    businessLogic.getUserByUserId(request, response);
})

module.exports = router;