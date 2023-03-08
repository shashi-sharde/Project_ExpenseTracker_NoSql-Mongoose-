const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotpasswordSchema = new Schema({
  _id: {
    type: String,  // change data type to String
    required: true,
  },
    
            active: {
                type: Boolean,
                required: true
              },
              expiresby: {
                type: Date,
                
              },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        
})

module.exports = mongoose.model('forgotpassword', ForgotpasswordSchema);