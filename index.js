const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave("FLWPUBK_TEST-f0e7f1c175bcc3c18e4064c7f6059909-X", "FLWSECK_TEST-00086f26dcd12bdd8c5790068bce4456-X"  );
const passport = require('passport')
const multer = require('multer')
let uniqid = require('uniqid'); 
const upload = multer();
const Readable = require('stream').Readable;
const {totheDrivers,totheDriversWhatsapp} = require('./googleDrive')
const {transferTobeneficiary} = require('./flutterWave')
const {paymentWeek,paymentMonth,paymentYear} = require('./model/moneyMakers');
const {paymentWeekAdvert,paymentMonthAdvert,paymentYearAdvert} = require('./model/advertisers');
const recordings = require('./model/recordings');
const { UserModel } = require('./model/users');
require('./athentication/google')


const DB = "mongodb+srv://DutereStory:DutereStory@cluster0.zo6ti8b.mongodb.net/DutereStory1?retryWrites=true&w=majority";
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((results) => {


    console.log('connected....');
  })
  .catch((err) => {
    console.warn(err)
  })

function bufferToStream(buffer) {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'keyboard.com',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(flash())
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'))
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  ));
app.get('/google/auth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get('/auth/google/success', (req, res) => {
  res.redirect('/')
})
app.get('/', (req, res) => {
  let user=req.user
  recordings.find().then((recordings)=>{
  if(req.user){
  paymentYear.find({tx_ref:user.paymentId}).then((paymentres)=>{
    paymentMonth.find({tx_ref:user.paymentId}).then((paymentres2)=>{
      paymentWeek.find({tx_ref:user.paymentId}).then((paymentres3)=>{
       if (paymentres.length >0){
      res.render('index', { user: req.user,payment:paymentres[0],stories:recordings})
    }else if(paymentres2.length >0){
      res.render('index', { user: req.user,payment:paymentres2[0],stories:recordings})
     
    }else if(paymentres3.length >0){
      res.render('index', { user: req.user,payment:paymentres3[0],stories:recordings})
    }else{
      res.render('index', { user: req.user,payment:{PaymentStatus:"unpayed"},stories:recordings})
    }
   
   }) })})
  }else{
    res.render('index',{user:req.user,stories:recordings})
  }
})    
})
app.get('/Advertiser',(req,res)=>{
  if(req.user){
    paymentYearAdvert.find({userName:req.user.userName}).then((paymentres)=>{
      paymentMonthAdvert.find({userName:req.user.userName}).then((paymentres2)=>{
        paymentWeekAdvert.find({userName:req.user.userName}).then((paymentres3)=>{
         if (paymentres.length >0){
          res.render('Advertiser', { user: req.user,paymentAD:paymentres[0]})
      }else if(paymentres2.length >0){
        res.render('Advertiser', { user: req.user,paymentAD:paymentres2[0]})
       
      }else if(paymentres3.length >0){
        res.render('Advertiser', { user: req.user,paymentAD:paymentres3[0]})
      }else{
        res.render('Advertiser', { user: req.user,paymentAD:{PaymentStatus:"unpayed"}})
      }
     
     }) })})
    }else{
      res.render('Advertiser',{user:req.user})
    }
})
app.get('/refferal',(req,res)=>{
  let user=req.user
  if(req.user){
    paymentYear.find({tx_ref:user.paymentId}).then((paymentres)=>{
      paymentMonth.find({tx_ref:user.paymentId}).then((paymentres2)=>{
        paymentWeek.find({tx_ref:user.paymentId}).then((paymentres3)=>{
         if (paymentres.length >0){
          res.render('Refferal', { user: req.user,payment:paymentres[0]})
      }else if(paymentres2.length >0){
        res.render('Refferal', { user: req.user,payment:paymentres2[0]})
       
      }else if(paymentres3.length >0){
        res.render('Refferal', { user: req.user,payment:paymentres3[0]})
      }else{
        res.render('Refferal', { user: req.user,payment:{PaymentStatus:"unpayed"}})
      }
     
     }) })})
    }else{
      res.render('Refferal',{user:req.user})
    }

})
app.get('/refferal/:userName',(req,res)=>{
  userName=req.params.userName;

})
app.post('/addLikes', (req, res) => {
  let userID = req.user.id
  let d=req.body.identity
  recordings.updateOne({userId:d}, { $addToSet: { likes: userID } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })

})

app.post('/addComments', (req, res) => {

  let id = req.body.identit
  let userComment = {name:req.user.userName, profile:req.user.ProfilePhotoUrl, realcomment:req.body.comment}
  recordings.updateOne({ userId: id }, { $addToSet: { comments: userComment } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })

})
app.post('/flutterWaveSubWeek', (req, res) => {
  
  const rw_mobile_money =  async (payload)=>{
 
    try {
       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
     req.flash('messageURL',`${response.meta.authorization.redirect}`)
     res.redirect('/')
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  var mykey2 = uniqid()
  new paymentWeek({
    userName:req.user.userName,
    tx_ref:mykey,
    Oder_Id:mykey2,
    PhoneNumber:req.body.phone
  }).save()
  UserModel.updateOne({ userName: user.userName }, { paymentId:mykey }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "1500",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})
app.post('/paymentWeekAdvert', (req, res) => {
  
  let user=req.user
   const rw_mobile_money =  async (payload)=>{
  
     try {
        const response =  await flw.MobileMoney.rwanda(payload)
        console.log(response);
      req.flash('messageURL2',`${response.meta.authorization.redirect}`)
      res.redirect('/Advertiser')
     } catch (error) {
         console.log(error)
     }                            
    
 }
   var mykey = uniqid()
   var mykey2 = uniqid()
   new paymentWeekAdvert({
     userName:req.user.userName,
     tx_ref:mykey,
     Oder_Id:mykey2,
     PhoneNumber:req.body.phone
   }).save()
   UserModel.updateOne({ userName: user.userName }, { paymentIdAdvert:mykey }, function (err, docs) {
     if (err) {
       console.log(err)
     }
   })
   let payload = {
     
     "tx_ref": mykey, 
     "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
     "amount": "20000",
     "currency": "RWF",
     "email":"munaziribnm@gmail.com",
     "phone_number": req.body.phone,
     "fullname": req.user.userName
 
   }
   rw_mobile_money(payload)
})

app.post('/flutterWaveSubMonth', (req, res) => {
  let user=req.user
  const rw_mobile_money =  async (payload)=>{
 
    try {
       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
     req.flash('messageURL',`${response.meta.authorization.redirect}`)
     res.redirect('/')
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  var mykey2 = uniqid()
  new paymentMonth({
    userName:req.user.userName,
    tx_ref:mykey,
    Oder_Id:mykey2,
    PhoneNumber:req.body.phone
  }).save();
  UserModel.updateOne({ userName: user.userName }, { paymentId:mykey }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "1000",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})

app.post('/FromWhatsapp',upload.any(),(req,res)=>{
  console.log(req.files)
  let views=req.body.Views;
  const user = req.user;
  const d = new Date();
let text = d.toISOString();
  let originalname = user.userName+" "+views+" "+text+'.png'
  var folderId = user.folderId;
  var fileMetadata = {
    'name': [originalname],
    parents: [folderId]
  };
  var media = {
    mimeType: req.files[0].mimetype,
    body: bufferToStream(req.files[0].buffer)
  };
 
  totheDriversWhatsapp(fileMetadata, media, user);
  req.flash('message1','Yoherejwe tegereza iminsi itatu')
  res.redirect('/')

})
app.get('/payment_callback/:userName', async (req, res) => {

 let user=req.user
  const transactionDetailsM = await paymentMonth.find({tx_ref:user.paymentId});
  const transactionDetailsW= await paymentWeek.find({tx_ref:user.paymentId});
  const transactionDetailsY=await paymentYear.find({tx_ref:user.paymentId});
  if (transactionDetailsM.length >0){
     const responseM= await flw.Transaction.verify({id:transactionDetailsM[0].tx_ref});
     if(responseM.message=="No transaction was found for this id" || responseM.status=="failed"){
      req.flash('message1','Ntiwishyuye')
      res.redirect('/')
    }else{
      paymentMonth.updateOne({tx_ref:user.paymentId}, { PaymentStatus:"payed" }, function (err, docs) {
        if (err) {
          console.log(err)
        }
        req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash')
        res.redirect('/')
      })
    }
  }else if(transactionDetailsW.length >0){
    const responseW = await flw.Transaction.verify({id:transactionDetailsW[0].tx_ref});
    if(responseM.message=="No transaction was found for this id" || responseW.status=="failed"){
      req.flash('message1','Ntiwishyuye')
      res.redirect('/')
    }else{
      paymentWeek.updateOne({tx_ref:user.paymentId}, { PaymentStatus:"payed" }, function (err, docs) {
        if (err) {
          console.log(err)
        }
        req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash')
        res.redirect('/')
      })
    }
  }else if(transactionDetailsY.length >0){
    const responseY = await flw.Transaction.verify({id:transactionDetailsY[0].tx_ref});
    if(responseM.message=="No transaction was found for this id" ||responseY.status=="failed"){
      req.flash('message1','Ntiwishyuye')
      res.redirect('/')
    }else{
      paymentYear.updateOne({tx_ref:user.paymentId}, { PaymentStatus:"payed" }, function (err, docs) {
        if (err) {
          console.log(err)
        }
        req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash Za Shares')
        res.redirect('/')
      })
    }
  } else{
    req.flash('message1','Ntiwishyuye')
        res.redirect('/')
  }
});
app.get('/payment_callback_Advert/:userName', async (req, res) => {

  let user=req.user
   const transactionDetailsM = await paymentMonthAdvert.find({tx_ref:user.paymentIdAdvert});
   const transactionDetailsW= await paymentWeekAdvert.find({tx_ref:user.paymentIdAdvert});
   const transactionDetailsY=await paymentYearAdvert.find({tx_ref:user.paymentIdAdvert});
   if (transactionDetailsM.length >0){
      const responseM= await flw.Transaction.verify({id:transactionDetailsM[0].tx_ref});
      if(responseM.message=="No transaction was found for this id" || responseM.status=="failed"){
       req.flash('message1','Ntiwishyuye')
       res.redirect('/')
     }else{
      paymentMonthAdvert.updateOne({ tx_ref: user.paymentIdAdvert }, { PaymentStatus:"payed" }, function (err, docs) {
         if (err) {
           console.log(err)
         }
         req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash')
         res.redirect('/')
       })
     }
   }else if(transactionDetailsW.length >0){
     const responseW = await flw.Transaction.verify({id:transactionDetailsW[0].tx_ref});
     if(responseM.message=="No transaction was found for this id" || responseW.status=="failed"){
       req.flash('message1','Ntiwishyuye')
       res.redirect('/')
     }else{
      paymentWeekAdvert.updateOne({ tx_ref: user.paymentIdAdvert }, { PaymentStatus:"payed" }, function (err, docs) {
         if (err) {
           console.log(err)
         }
         req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash')
         res.redirect('/')
       })
     }
   }else if(transactionDetailsY.length >0){
     const responseY = await flw.Transaction.verify({id:transactionDetailsY[0].tx_ref});
     if(responseM.message=="No transaction was found for this id" ||responseY.status=="failed"){
       req.flash('message1','Ntiwishyuye')
       res.redirect('/')
     }else{
       paymentYear.updateOne({ tx_ref: user.paymentIdAdvert }, { PaymentStatus:"payed" }, function (err, docs) {
         if (err) {
           console.log(err)
         }
         req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash Za Shares')
         res.redirect('/')
       })
     }
   } else{
     req.flash('message1','Ntiwishyuye')
         res.redirect('/')
   }
 });

app.post('/flutterWaveSubYear', (req, res) => {
 let user=req.user
  const rw_mobile_money =  async (payload)=>{
 
    try {
       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
     req.flash('messageURL',`${response.meta.authorization.redirect}`)
     res.redirect('/')
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  var mykey2 = uniqid()
  new paymentYear({
    userName:req.user.userName,
    tx_ref:mykey,
    Oder_Id:mykey2,
    PhoneNumber:req.body.phone
  }).save()
  UserModel.updateOne({ userName: user.userName }, { paymentId:mykey }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "50000",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})


app.post('/flutterWaveWithDraw', (req, res) => {

  
 
  let payload = {
    
     account_bank: "MPS",
        account_number: req.body.phoneN,
        amount: req.body.Amount,
        currency: "RWF",
        beneficiary_name: req.user.userName,
        meta: {
          "sender": "DutereStory Developers",
          "sender_country": "RWA",
          "mobile_number": "250790457824"
        }
  }
  transferTobeneficiary(payload)
})
app.post('/addViews', (req, res) => {
  let id = req.body.id
  recordings.findOne({ userId: id }).then((results) => {
    let newViews = results.views++
    recordings.updateOne({ userId: id }, { views: newViews }, function (err, docs) {
      if (err) {
        console.log(err)
      }
    })
  })

})
app.post('/addViewsStatus', (req, res) => {
  let id = req.body.id
  recordings.findOne({ userId: id }).then((results) => {
    let newViews = results.views++
    recordings.updateOne({ userId: id }, { views: newViews }, function (err, docs) {
      if (err) {
        console.log(err)
      }
    })
  })

})
app.post('/ToTheDrive', upload.any(), (req, res) => {
  
  console.log(req.files[0])
  // const user = req.user;
  // let files = req.files;
  // let RecordTitle=req.body.Title;
  // let filepath = "./audioUploads/";
  // let originalname = files[0].originalname + '.aac'
  // let stringedFilePath = filepath + originalname;
  // var folderId = user.folderId;
  // var fileMetadata = {
  //   'name': [originalname],
  //   parents: [folderId]
  // };
  // var media = {
  //   mimeType: 'audio/aac',
  //   body: bufferToStream(req.files[0].buffer)
  // };

  // totheDrivers(fileMetadata, media,RecordTitle, stringedFilePath, user, folderId);


})




const port = process.env.PORT || 3300
app.listen(port, () => {
  console.log('heard from port')
})