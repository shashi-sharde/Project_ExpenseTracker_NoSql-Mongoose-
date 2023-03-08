const userController = require('../Controllers/Usercontrol')

const express = require('express')
const router = express.Router();


router.post('/users/signup', userController.signUp)

module.exports = router