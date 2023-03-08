

const expenseController = require('../Controllers/ExpenseControl');

const Userauthentication = require('../Middleware/auth')

const express = require('express');
const router = express.Router();


router.post(`/users/login/get-expense/:page`,Userauthentication.authenticate,  expenseController.getExpenses);


router.post('/users/login/add-expense', Userauthentication.authenticate,expenseController.postAddExpenses);

router.get('/user/download', Userauthentication.authenticate, expenseController.downloadexpense);

router.get('/user/getAllUrl', Userauthentication.authenticate, expenseController.getDownloadUrls)

router.delete('/users/login/delete-expense/:expenseId', expenseController.deleteExpense);


module.exports = router;