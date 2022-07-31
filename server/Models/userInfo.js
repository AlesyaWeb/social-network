const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");
const ApiError = require("../exceptions/api-errors");


const UserInfo = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    description: {type: String},
    gender: {type: String, required: true},
    photo_50: {type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png'},
    age: {type: String, required: true},
    status: {type: String},
    friends: {type: Array},
    sentFlQueries: {type: Array},
    waitingFlAccept: {type: Array}
})

// UserInfo.post('save', function(error, doc, next) {
//     let err = doc.validateSync();
//     err instanceof mongoose.Error.ValidationError; // true
//     if(err){
//         console.log(err)
//         throw ApiError.BadRequest(`Ошибка. Проверьте, все ли поля заполнены`);
//     }
// });


module.exports = model('UserInfo', UserInfo)