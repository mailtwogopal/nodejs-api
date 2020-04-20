const objectId = require('mongodb').ObjectID

module.exports = {

insertUsers(request, response) {
    collection.insert(request.body, (error,result) => {
        if(error){
            return response.status(500).send(error);
        }
        response.send(JSON.stringify(result));
    })
},

getAllUsers(request, response) {
collection.find({}).toArray((error, result) => {
    if(error){
        return response.status(500).send(error);
    }
    response.send(result);
})
},

getUserByUserId(request, response) {
    collection.findOne({"_id": new objectId(request.params.id)}, (error, result) => {
        if(error){
            return response.status(500).send(error);
        }
        response.send(result);
    })
}

}