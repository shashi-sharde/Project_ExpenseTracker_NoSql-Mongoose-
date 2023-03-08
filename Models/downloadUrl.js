const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DownloadurlSchema = new Schema({
    filename: {
                type: String,
                required: true   
            },
            fileurl: {
                type: String,
                required: true,

                  },
                  
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        
})

module.exports = mongoose.model('downloadurl', DownloadurlSchema);