const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userName:{
        type: String,

    },
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    views:{
        type: String,
        required: true,
        default:"0"

    },
    clicks:{
        type: Number,
        required: true,
        default:"0"

    },
    CashLeft:{
        type: Number,
        required: true,
        default:"0"

    },

    WhatsappScreenShotPosts:[],    
    tx_ref:{
        type: String,
    },
    Oder_Id:{
        type: String,
    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"pending"

    },
    PackageDuration:{
        type: String,
        required: true,
        default:"7"

    },
    createdAt: { type: Date, expires: '7d', default: Date.now }

})
const UserSchema2 = new Schema({
    userName:{
        type: String,

    },
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    views:{
        type: String,
        required: true,
        default:"0"

    },
    clicks:{
        type: Number,
        required: true,
        default:"0"

    },
    CashLeft:{
        type: Number,
        required: true,
        default:"0"

    },

    WhatsappScreenShotPosts:[],    
    tx_ref:{
        type: String,
    },
    Oder_Id:{
        type: String,
    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"pending"

    },
    PackageDuration:{
        type: String,
        required: true,
        default:"30"

    },
    createdAt: { type: Date, expires: '30d', default: Date.now }

})
const UserSchema3 = new Schema({
    userName:{
        type: String,

    },
    PhoneNumber:{
        type: String,
        required: true,
        default:"+250780000000"

    },
    views:{
        type: String,
        required: true,
        default:"0"

    },
    clicks:{
        type: Number,
        required: true,
        default:"0"

    },
    CashLeft:{
        type: Number,
        required: true,
        default:"0"

    },

    WhatsappScreenShotPosts:[],    
    tx_ref:{
        type: String,
    },
    Oder_Id:{
        type: String,
    },
    PaymentStatus:{
        type: String,
        required: true,
        default:"pending"

    },
    PackageDuration:{
        type: String,
        required: true,
        default:"360"

    },
     createdAt: { type: Date, expires: '1y', default: Date.now }

})

const paymentWeek=mongoose.model('paymentsWeek',UserSchema);
const paymentMonth=mongoose.model('paymentsMonth',UserSchema2);
const paymentYear=mongoose.model('paymentsYear',UserSchema3);

module.exports={paymentWeek,paymentMonth,paymentYear};