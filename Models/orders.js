
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
            paymentid: {
                type: String,
                  
            },
            orderid: {
                type: String,
                
                 
            },
            status: {
                type: String,
                
            },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

        
})

module.exports = mongoose.model('order', OrderSchema);
