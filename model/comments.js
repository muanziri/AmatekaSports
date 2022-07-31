const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    RecorderId:{
        type: String,
        required: true,
    

    },
    userName:{
        type: String,
        required: true,
    

    },
    userProfile:{
        type: String,
        required: true,
    

    },
    Comments:{
        type: String,
        required: true,
    

    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const commentModel=mongoose.model('Comments',UserSchema);
module.exports=commentModel;