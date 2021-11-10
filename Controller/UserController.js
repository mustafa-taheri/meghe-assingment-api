// Services
const UserService = require('../Services/UserServices')

// Utils
const CryptoJS = require('crypto-js')
const ErrorBody = require('../Utils/ErrorBody')
const { validationResult } = require('express-validator')

exports.register = (req, res, next) => {
    let _reqBody = Object.assign({}, req.body);
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        throw new ErrorBody(400, "Invalid Request Body", errors)
    } else {
        UserService.getUserByEmail(_reqBody.email).then(result => {
            if (result && result.length > 0) {
                throw new ErrorBody(400, 'Email ID already registered')
            } else {
                let _encyPass = CryptoJS.MD5(_reqBody.password).toString()
                _reqBody.password = _encyPass
                return UserService.registerUser(_reqBody)
            }
        }).then(result => {
            if (result.password) {
                delete result.password
            }
            res.status(201);
            res.json(result);
        }).catch(error => {
            next(new ErrorBody(error.statusCode || 500, error.message || "Something Went Wrong", error.errors || []))
        })
    }
}