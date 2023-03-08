const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            MoneySpent: {
                type: Number,
                required: true   
            },
            Description: {
                type: String,
                required: true,
            },
            Categories: {
                type: String,
                required: true 
            }
            
        
        
})

module.exports = mongoose.model('expenses', ExpenseSchema);