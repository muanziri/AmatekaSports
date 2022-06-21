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
    Recordings: [String],
    likes: [String],
    comments: [String],
    PaidDate:{
        type: String,
        required: true,
        default:"to day"
    },
    balance:{
        type: Number
    },
    paymentStatus:{
        type: String,
        required: true,
        default:"UnPayed" 
    },
    phoneNumber:{
        type: String,
        required: true,
        default:"+25078---" 
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

module.exports=UserModel;