const express = require('express');

const router = express.Router();

const leaderBoardController = require('../Controllers/premiumFeature');

const Userauthentication =require('../Middleware/auth')


router.get('/Show_leaderBoard',Userauthentication.authenticate ,leaderBoardController.getPremiumLeaderBoard);


module.exports = router;