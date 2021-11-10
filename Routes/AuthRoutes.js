const express = require('express')
const router = express.Router()

const authController = require('../Controller/AuthController')
const { body } = require('express-validator')

router.post('/login',
    [body('email').isEmail().not().isEmpty(), body('password').not().isEmpty()],
    authController.login
)

// router.post('/forgotpassword',
//     [body('email').isEmail().not().isEmpty()],
//     authController.forgotPassword
// )

// router.post('/resetpassword',
//     [body('emailToken').not().isEmpty(), body('newPassword').not().isEmpty()],
//     authController.resetPassword
// )

router.post('/refreshtoken',
    [body('token').isJWT()],
    authController.refreshToken
)


module.exports = router