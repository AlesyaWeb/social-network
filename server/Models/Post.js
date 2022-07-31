

const {Schema, model} = require('mongoose')

const Post = new Schema({
    author: {type: Schema.Types.ObjectId},
    postText: {type: String},
    postThumbnails: {type: Schema.Types.Mixed},
    likes: {type: Array},
    dislikes: {type: Array}
})

module.exports = model('Post', Post)