const express = require('express')
const router = express.Router()

const userController = require('../Controller/UserController')
const { body } = require('express-validator')


router.post('/register',
    [body('email').isEmail().not().isEmpty(), body('password').not().isEmpty(), body('mobile').isMobilePhone().not().isEmpty(), body('fullname').not().isEmpty()],
    userController.register
)

module.exports = router