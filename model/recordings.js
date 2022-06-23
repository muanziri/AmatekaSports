const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    RecordingId:{
        type: String,
        required: true

    },
    views:{
        type: Number,
        required: true,
         default:0
    },
   likes:[string],
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('recordings',UserSchema);

module.exports=UserModel;