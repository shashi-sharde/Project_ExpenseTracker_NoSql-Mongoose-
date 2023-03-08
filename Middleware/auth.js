const jwt = require('jsonwebtoken');
const User = require('../Models/Userdetails');

const authenticate = (req, res, next) =>{
    try{
        const token = req.header('Authorization');
    const user = jwt.verify(token,'secret');
    
    User.findById(user.userId).then( user =>{
        console.log('user',user)
        req.user = user;
        console.log("THis is user datails",req.user)
        next();
    }).catch(err =>{
        throw new Error(err)
    })

    }catch(err){
        console.log(err);
       return  res.status(500).json({success:false})
    }
}

module.exports = {authenticate }