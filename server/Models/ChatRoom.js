const {Schema, model} = require('mongoose')
const uuid = require('uuid');
const chatRoom = new Schema({
    userIds: [{type: Schema.Types.ObjectId}],
    type: {type: String},
    chatInitiator: {type: String},
}, {timestamps: true})


module.exports = model('chatRoom', chatRoom)