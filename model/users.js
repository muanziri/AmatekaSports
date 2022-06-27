const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    ProfilePhotoUrl: {
        type: String,
        required: true
    },
    AuthId: {
        type: String,
        required: true
    },
    folderId: {
        type: String,
        required: true
    },
    Recordings: [String],
    views: {
        type: Number,
        required: true,
        default:0
    },
    balance:{
        type: Number
    },
    phoneNumber:{
        type: String,
        required: true,
        default:"+250780000000" 
    },
    paymentStatus:{
        type: String,
        required: true,
        default:"innitailPayment" 
    },
    Clicks: {
        type: Number,
        required: true,
        default:0
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('users',UserSchema);
module.exports={UserModel};