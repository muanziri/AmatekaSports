const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    PhoneNumber:{
        type: String,
        required: true,
        default:"payed"

    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"payed"

    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('payments',UserSchema);

module.exports=UserModel;