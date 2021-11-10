const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    fullname: {
        type: Schema.Types.String,
        required: false
    },
    email: {
        type: Schema.Types.String,
        unique : true,
        required: true
    },
    mobile: {
        type: Schema.Types.Number,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    gender : {
        type: Schema.Types.String,
        required : false
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
