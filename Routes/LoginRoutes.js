
const userController = require('../Controllers/Usercontrol');


const express = require('express')

const router = express.Router();


router.post('/users/login',userController.login);


module.exports = router