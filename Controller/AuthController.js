// Services
const UserService = require('../Services/UserServices')

// Utils
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
const ErrorBody = require('../Utils/ErrorBody')
const { validationResult } = require('express-validator')

exports.login = (req, res, next) => {
    let _reqBody = Object.assign({}, req.body);
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        throw new ErrorBody(400, "Invalid request body", errors);
    } else {
        let _user = {};
        UserService.getUserByEmail(_reqBody.email).then(result => {
            //match the password                        
            if (result && result.length > 0) {
                _user = result[0]
                if (CryptoJS.MD5(_reqBody.password).toString() === _user.password) {
                    return generateJWTs({
                        email: _user.email,
                        id: _user.id
                    }, {
                        email: _user.email
                    })
                } else {
                    //user does not exists
                    throw new ErrorBody(400, "Invalid username or password.", []);
                }
            } else {
                //user does not exists
                throw new ErrorBody(400, "Invalid username or password.", []);
            }
        }).then(jwts => {
            res.status(200);
            res.json({
                userId: _user.id,
                fullname: _user.fullname,
                mobile: _user.mobile,
                gender: _user.gender,
                email: _user.email,
                token: jwts.token,
                refreshToken: jwts.refreshToken
            })
        }).catch(error => {
            next(new ErrorBody(error.statusCode || 500, error.message || "Server Error Occurred", error.errors || []))
        })
    }
}


exports.refreshToken = (req, res, next) => {
    let _refreshToken = req.body.token;
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        throw new ErrorBody(400, "Invalid Request Body", errors)
    } else {
        //decode the refresh token and generate a new token
        jwt.verify(_refreshToken, process.env.ASSIGN_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                throw new ErrorBody(400, "Invalid token", []);
            } else {
                let _email = decoded.email;
                UserService.getUserByEmail(_email).then(result => {
                    if (result && result.length > 0) {
                        let _user = result[0]
                        return generateJWTs({
                            email: _user.email,
                            fullname: _user.fullname,
                            id: _user.id
                        }, {
                            email: _user.email
                        })
                    } else {
                        throw new ErrorBody(400, "Invalid token", []);
                    }
                }).then(jwts => {
                    res.status(200);
                    res.json({
                        token: jwts.token
                    })
                }).catch(error => {
                    next(new ErrorBody(error.statusCode || 500, error.message || "Server Error occurred",  error.errors || []));
                })
            }
        })
    }
}

function generateJWTs(payload, refreshPayload) {
    return new Promise(function (resolve, reject) {
        let token = jwt.sign(payload, process.env.ASSIGN_SECRET, {
            expiresIn: "2m"
        });
        let _refreshToken = jwt.sign(refreshPayload, process.env.ASSIGN_REFRESH_SECRET, {
            expiresIn: "7d"
        })
        if (token && _refreshToken) {
            resolve({
                token: token,
                refreshToken: _refreshToken
            })
        } else {
            reject(new ErrorBody(500, "Unable to generate the tokens", error.errors || []));
        }
    })
}