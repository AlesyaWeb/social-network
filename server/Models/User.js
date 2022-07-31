const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, unique: true, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    password: {type: String, required: true}
})


module.exports = model('User', User)