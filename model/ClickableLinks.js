const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

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

const ClickableLink=mongoose.model('ClickableLink',UserSchema);
module.exports={ClickableLink};