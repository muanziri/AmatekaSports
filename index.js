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
const totheDrivers = require('./googleDrive')
const {paymentWeek,paymentMonth,paymentYear} = require('./model/moneyMakers');
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
  if(req.user){
  paymentYear.find({userName:req.user.userName}).then((paymentres)=>{
    paymentMonth.find({userName:req.user.userName}).then((paymentres2)=>{
      paymentWeek.find({userName:req.user.userName}).then((paymentres3)=>{
    //    if (paymentres){
    //   res.render('index', { user: req.user,payment:paymentres})
    // }else if(paymentres2==null){
    //   res.render('index', { user: req.user,payment:paymentres2})
    //   console.log(paymentres2)
    // }else if(paymentres3==null){
    //   res.render('index', { user: req.user,payment:paymentres3})
    // }
    res.render('index',{user:req.user,payment:paymentres2[0]})
    console.log(paymentres2)
   }) })})
  }else{
    res.render('index',{user:req.user})
  }
     
})
app.post('/addLikes', (req, res) => {
  let userID = req.user.id
  let id = req.body.id
  recordings.findOneAndUpdate({ userId: id }, { $addToSet: { likes: userID } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })

})
app.post('/addClicks', (req, res) => {


})
app.post('/addComments', (req, res) => {

  let id = req.body.id
  let userComment = [req.user.userName, req.user.ProfilePhotoUrl, req.body.comment]
  recordings.findOneAndUpdate({ userId: id }, { $addToSet: { comments: userComment } }, function (err, docs) {
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

app.post('/flutterWaveSubMonth', (req, res) => {

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
  }).save()
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "500",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})
app.get('/payment_callback_Week/:userName', async (req, res) => {
  let userNAME=req.params.userName;
  const transactionDetails = await paymentYear.findOne({userName:userNAME});
  const response = await flw.Transaction.verify({id:transactionDetails.tx_ref});
  console.log(response);
  // let userNAME=req.params.userName
  // if (req.query.status === 'successful') {
  //     const transactionDetails = await paymentWeek.find({userName:userNAME});
  //     const response = await flw.Transaction.verify({id:transactionDetails.tx_ref});
  //     if (
  //         response.data.status === "successful"
  //         && response.data.currency === "RWF") {
  //         // Success! Confirm the customer's payment
  //     } else {
  //         // Inform the customer their payment was unsuccessful
  //     }
  // }
});
app.get('/payment_callback_Month/:userName', async (req, res) => {
  let userNAME=req.params.userName;
 // const transactionDetailsW = await paymentWeek.findOne({userName:userNAME});
  const transactionDetailsM = await paymentMonth.findOne({userName:userNAME});
  //const transactionDetailsY = await paymentYear.findOne({userName:userNAME});
  const responseM = await flw.Transaction.verify({id:transactionDetailsM.tx_ref});
  console.log(responseM);
  res.redirect('/')
  // const responseW = await flw.Transaction.verify({id:transactionDetailsW.tx_ref});
   
  // const responseY = await flw.Transaction.verify({id:transactionDetailsY.tx_ref});
  // console.log(responseW);

  // console.log(responseY);
  // let userNAME=req.params.userName
  // if (req.query.status === 'successful') {
  //     const transactionDetails = await paymentMonth.find({userName:userNAME});
  //     const response = await flw.Transaction.verify({id:transactionDetails.tx_ref});
  //     if (
  //         response.data.status === "successful"
  //         && response.data.currency === "RWF") {
  //         Success! Confirm the customer's payment
  //     } else {
  //         Inform the customer their payment was unsuccessful
  //     }
  // }
});
app.get('/payment_callback_Year/:userName', async (req, res) => {
  let userNAME=req.params.userName;
  const transactionDetails = await paymentYear.findOne({userName:userNAME});
  const response = await flw.Transaction.verify({id:transactionDetails.tx_ref});
  console.log(response);
  // if (req.query.status === 'successful') {
  //     const transactionDetails = await paymentYear.findOne({userName:userNAME});
  //     const response = await flw.Transaction.verify({id:transactionDetails.tx_ref});
  //     if (
  //         response.data.status === "successful"
  //         && response.data.currency === "RWF") {
  //         // Success! Confirm the customer's payment
  //     } else {
  //         // Inform the customer their payment was unsuccessful
  //     }
  // }
});
app.post('/flutterWaveSubYear', (req, res) => {

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

app.post('/addViews', (req, res) => {
  let id = req.body.id
  recordings.findOne({ userId: id }).then((results) => {
    let newViews = results.views++
    recordings.findOneAndUpdate({ userId: id }, { views: newViews }, function (err, docs) {
      if (err) {
        console.log(err)
      }
    })
  })

})
app.post('/ToTheDrive', upload.any(), (req, res) => {

  const user = req.user;
  let files = req.files;

  let filepath = "./audioUploads/";
  let originalname = files[0].originalname + '.aac'
  let stringedFilePath = filepath + originalname;
  var folderId = user.folderId;
  var fileMetadata = {
    'name': [originalname],
    parents: [folderId]
  };
  var media = {
    mimeType: 'audio/aac',
    body: bufferToStream(req.files[0].buffer)
  };

  totheDrivers(fileMetadata, media, stringedFilePath, user, folderId);


})




const port = process.env.PORT || 3300
app.listen(port, () => {
  console.log('heard from port')
})