const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"payed"

    },
    createdAt: { type: Date, expires: '7d', default: Date.now }

})
const UserSchema2 = new Schema({
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"payed"

    },
    createdAt: { type: Date, expires: '30d', default: Date.now }

})
const UserSchema3 = new Schema({
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"payed"

    },
    createdAt: { type: Date, expires: '1y', default: Date.now }

})

const paymentWeek=mongoose.model('paymentsWeek',UserSchema);
const paymentMonth=mongoose.model('paymentsMonth',UserSchema2);
const paymentYear=mongoose.model('paymentsYear',UserSchema3);

module.exports={paymentWeek,paymentMonth,paymentYear};