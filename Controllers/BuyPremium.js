const Razorpay  = require('razorpay'); //Envoking the Razorpay Library 
const Order = require('../Models/orders') // Envoking the Orders Model 
const User = require('../Models/Userdetails');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(id, username, isPremiumUser) {
  return jwt.sign({ userId: id, username: username, isPremiumUser }, 'secret');
}

const buyPremium = async (req, res, next) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    const order = await rzp.orders.create({ amount, currency: 'INR' });

    const newOrder = new Order({ orderId: order.id, status: 'PENDING' });

    await newOrder.save();

    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};

const updateTransactionStatus = async (req, res, next) => {
    try {
      // storing the id from user table
      const userId = req.user._id;
      // taking the details of payment id and order id
      const { payment_id, order_id } = req.body;
      // finding the order using order id 
      const order = await Order.findOne({ orderId: order_id });
  
      if (!payment_id) {
        const promise1 = Order.updateOne({ status: 'FAILED' });
        const promise2 = User.updateOne({ _id: userId }, { isPremiumUser: false });
        Promise.all([promise1, promise2]).then(() => {
          const token = generateAccessToken(userId, undefined, false);
          return res.status(407).json({ success: false, message: 'Transaction Failed', token });
        }).catch((error) => {
          throw new Error(error);
        });
      } else {
        // updating the payment id and status only after the payment is successful 
        const promise3 = Order.updateOne({ paymentId: payment_id, status: 'SUCCESSFUL' });
        // Upon successful payment and status is updated, updating the user table as the user is premium or not 
        const promise4 = User.updateOne({ _id: userId }, { isPremiumUser: true });
        // Now setting the promise and sending the status on which user above promises will be applied.
        Promise.all([promise3, promise4]).then(() => {
          const token = generateAccessToken(userId, undefined, true);
          return res.status(202).json({ success: true, message: 'Transaction Successful', token });
        }).catch((error) => {
          throw new Error(error);
        });
      }
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: err, message: 'Something went wrong' });
    }
  };
module.exports = { buyPremium, updateTransactionStatus };