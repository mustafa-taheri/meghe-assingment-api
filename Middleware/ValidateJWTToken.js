const jwt = require("jsonwebtoken");
const ErrorBody = require('../Utils/ErrorBody')

exports.verifyJWT = (req, res, next) => {
    let _token = req.headers.authorization;
    decodeJWT(_token).then(result => {
        req.itsNumber = result.itsNumber;
        req.name = result.name;
        req.role = result.role;
        req.id = result.id;
        next();
    }).catch(error => {
        next(new ErrorBody(401, "Invalid JWT, user unauthorized", []));
    })
}

function decodeJWT(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, process.env.FMB_SECRET, (err, decode) => {
            if (err) {
                reject(new ErrorBody(401, "Invalid JWT, user unauthorized", []));
            } else {
                resolve(decode);
            }
        })
    })
}