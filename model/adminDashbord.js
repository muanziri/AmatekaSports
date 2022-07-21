const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    moneyIn:{
        type: Number,
        required: true,
        default:0

    },
    moneyOut:{
        type: Number,
        required: true,
        default:0

    },
    link:{
        type: String,
        required: true,
        

    },
    link:{
        type: String,
        required: true,
        

    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const ClickableLink=mongoose.model('adminDash',UserSchema);
module.exports={ClickableLink};