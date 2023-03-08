const path = require('path') //invoking the path
const express = require('express') // invoking Express Module

const mongoose = require('mongoose');

require('dotenv').config();
//const helment =require('helmet')


//Envoking All the routers to the application

const signupRoute = require('./Routes/SignupRoutes')
const loginRoute = require('./Routes/LoginRoutes');
const expenseRoute = require('./Routes/ExpenseRoute');
const purchaseRoute = require('./Routes/Purchase');
const premiumfeatureRoute = require('./Routes/leaderboardRoute')
const forgotpasswordRoute = require('./Routes/ResetPassRoute')


const cors = require('cors') // Used for the cross origin platform 



//Crating Express Application
const app = express()

//Making all the application request as Json 
app.use(express.json())
app.use(cors())
//app.use(helmet())

// Using all the routers
app.use(signupRoute);
app.use(loginRoute);
app.use(expenseRoute)
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumfeatureRoute)
app.use(forgotpasswordRoute)


app.use((req,res)=>{
    res.sendFile(path.join(__dirname, `/views/${req.url}`))
})

mongoose.connect(
    'mongodb+srv://ShashiExpense:Shashi7033@cluster2.niwfjvc.mongodb.net/expenses?retryWrites=true&w=majority')
    .then(result =>{
      app.listen(3000)
      console.log("APP STARTED")
    })
    .catch(err =>{
      console.log(err)
    })

