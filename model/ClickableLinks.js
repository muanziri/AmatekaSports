const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    link:{
        type: String,
        required: true,
    

    },
    Discription:{
        type: String,
        required: true,
    },
    clicks:{
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

const ClickableLink=mongoose.model('ClickableLink',UserSchema);
module.exports={ClickableLink};