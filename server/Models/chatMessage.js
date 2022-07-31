const {Schema, model} = require('mongoose')
const uuid = require('uuid');
const MESSAGE_TYPES = {
    TYPE_TEXT: "text",
};
const readByRecipient  = new Schema({
    _id: false,
    readByUserId: {type: String},
    readAt: {type: Date, default: Date.now()},
}, {timestamps: false})

const chatMessage = new Schema({
    chatRoomId: {type: Schema.Types.ObjectId},
    message: {type: Schema.Types.Mixed,  default: () => MESSAGE_TYPES.TYPE_TEXT},
    postedByUser: {type: Schema.Types.ObjectId},
    readByRecipients: [readByRecipient],
}, {timestamps: true})

module.exports = model('chatMessage', chatMessage)