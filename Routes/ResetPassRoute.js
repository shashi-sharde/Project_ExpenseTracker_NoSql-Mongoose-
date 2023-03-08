const express = require('express')
const forgotPasswordController = require('../Controllers/ResetPassControl')


const router = express.Router()

router.get('/password/forgotpassword',forgotPasswordController.fogetpassDetails)
router.use('/password/forgotpassword', forgotPasswordController.forgotpassword)
router.get('/password/updatepassword/:resetpasswordid', forgotPasswordController.updatepassword)
router.use('/password/resetpassword/:id', forgotPasswordController.resetpassword)
module.exports=router




