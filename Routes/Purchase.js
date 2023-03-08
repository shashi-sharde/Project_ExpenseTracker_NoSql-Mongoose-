// Invoking the Express Library
const express = require('express');

// Initializing the BuyPremium Controller
const purchaseController = require('../Controllers/BuyPremium');

//Initializing the Authentication Middleware
const authenticationMiddelware = require('../Middleware/auth');

//Creating Router Express Application
const router = express.Router();


// Using the Requests
router.get('/premiummembership', authenticationMiddelware.authenticate, purchaseController.buyPremium);

router.post('/updateTransactionStatus', authenticationMiddelware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
