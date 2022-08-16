const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userName:{
        type: String,
        required: true

    },
    Phone:{
        type: String,
        required: true
    },
    Ammount:{
        type: String,
        required: true
    },
   
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('bikuza',UserSchema);

module.exports=UserModel;