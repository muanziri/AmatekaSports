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
        type: Number,
        required: true,
        default:0

    },
    clicks:{
        type: Number,
        required: true,
        default:0

    },
    CashLeft:{
        type: Number,
        required: true,
        default:0

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
        type: Number,
        required: true,
        default:0

    },
    clicks:{
        type: Number,
        required: true,
        default:0

    },
    CashLeft:{
        type: Number,
        required: true,
        default:0

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
        type: Number,
        required: true,
        default:0

    },
    clicks:{
        type: Number,
        required: true,
        default:0

    },
    CashLeft:{
        type: Number,
        required: true,
        default:0

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
     createdAt: { type: Date, expires: '1y', default: Date.now }

})

const paymentWeekAdvert=mongoose.model('paymentWeekAdvert',UserSchema);
const paymentMonthAdvert=mongoose.model('paymentMonthAdvert',UserSchema2);
const paymentYearAdvert=mongoose.model('paymentYearAdvert',UserSchema3);

module.exports={paymentWeekAdvert,paymentMonthAdvert,paymentYearAdvert};