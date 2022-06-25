const mongoose = require('mongoose');
const Schema = mongoose.Schema
const payement=new Schema({
    createdAt: { type: Date, expires: '2m', default: Date.now },
    status:{
        type:String,
        default:'payed'
    }

   })
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
    subscription:[payement],
    balance:{
        type: Number
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
module.exports={UserModel};