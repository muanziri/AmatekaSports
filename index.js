const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('flash')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave("FLWPUBK_TEST-f0e7f1c175bcc3c18e4064c7f6059909-X", "FLWSECK_TEST-00086f26dcd12bdd8c5790068bce4456-X"  );
const crypto = require('crypto')
const passport = require('passport')
const multer = require('multer')
let uniqid = require('uniqid'); 
const upload = multer();
const Readable = require('stream').Readable;
const totheDrivers = require('./googleDrive')
const {paymentWeek,paymentMonth,paymentYear} = require('./model/moneyMakers');
const recordings = require('./model/moneyMakers');
const {rw_mobile_money,transferTobeneficiary} = require('./flutterWave');
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
  paymentYear.find({PhoneNumber:req.user.PhoneNumber}).then((paymentres)=>{
    paymentMonth.find({PhoneNumber:req.user.PhoneNumber}).then((paymentres2)=>{
      paymentWeek.find({PhoneNumber:req.user.PhoneNumber}).then((paymentres3)=>{
      res.render('index', { user: req.user,paymentYear:paymentres,paymentMonth:paymentres2,paymentWeek:paymentres3})
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

      // const payload = {
      //     "tx_ref": "MC-158523s09v5050e8", //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      //     "order_id": "USS_URG_893982923s2323", //Unique ref for the mobilemoney transaction to be provided by the merchant
      //     "amount": "1500",
      //     "currency": "RWF",
      //     "email": "olufemi@flw.com",
      //     "phone_number": "054709929220",
      //     "fullname": "John Madakin"
      // }

     const response =  await flw.MobileMoney.rwanda(payload)
     console.log(response);
     res.redirect(response.meta.authorization.redirect)
  } catch (error) {
      console.log(error)
  }                            
 
}
  var mykey = uniqid()
  let payload = {

    "tx_ref": mykey,
    "order_id": mykey, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "1500",
    "currency": "RWF",
    "email": "munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})

app.post('/flutterWaveSubMonth', (req, res) => {

  const rw_mobile_money =  async (payload)=>{
 
    try {

        // const payload = {
        //     "tx_ref": "MC-158523s09v5050e8", //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
        //     "order_id": "USS_URG_893982923s2323", //Unique ref for the mobilemoney transaction to be provided by the merchant
        //     "amount": "1500",
        //     "currency": "RWF",
        //     "email": "olufemi@flw.com",
        //     "phone_number": "054709929220",
        //     "fullname": "John Madakin"
        // }

       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
       res.redirect(response.meta.authorization.redirect)
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "5000",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})

app.post('/flutterWaveSubYear', (req, res) => {

  const rw_mobile_money =  async (payload)=>{
 
    try {

        // const payload = {
        //     "tx_ref": "MC-158523s09v5050e8", //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
        //     "order_id": "USS_URG_893982923s2323", //Unique ref for the mobilemoney transaction to be provided by the merchant
        //     "amount": "1500",
        //     "currency": "RWF",
        //     "email": "olufemi@flw.com",
        //     "phone_number": "054709929220",
        //     "fullname": "John Madakin"
        // }

       const response =  await flw.MobileMoney.rwanda(payload)
       console.log(response);
       res.redirect(response.meta.authorization.redirect);
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  let payload = {

    "tx_ref": mykey, 
    "order_id":mykey,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": "50000",
    "currency": "RWF",
    "email": "munaziribnm@gmail.com",
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