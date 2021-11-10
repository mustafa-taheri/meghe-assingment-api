const UserModel = require('../Models/UserModel')

exports.registerUser = (reqBody) => {
    return UserModel.create(reqBody);
}

exports.getUserByEmail = (email) => {
    return UserModel.find({
        email: email
    }, "-__v")
}

exports.getUserByID = (id) => {
    return UserModel.find({
        _id: id
    }, "-__v -password")
}

exports.updateUserByID = (id, reqBody) => {
    return UserModel.updateOne({
        _id: id
    }, reqBody)
}

exports.deleteUser = (id) => {
    return UserModel.findOneAndDelete({
        _id: id
    })
}