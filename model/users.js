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
    paymentId: {
        type: String,
    },
    likes:{
     type:Number,
     required:true,
     default:0

    },
    Votes:{
        type:Number,
        required:true,
        default:0
    },
    titleRecordings: [String],
    Recordings: [String],
    phoneNumber:{
        type: String,
        required: true,
        default:"+250780000000" 
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('users',UserSchema);
module.exports={UserModel};