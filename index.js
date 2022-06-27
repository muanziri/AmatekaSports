const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('flash')
const crypto = require('crypto')
const passport = require('passport')
const multer = require('multer')
const upload = multer();
const Readable = require('stream').Readable;
const totheDrivers = require('./googleDrive')
const payment = require('./model/recordings');
const recordings = require('./model/moneyMakers');
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
    res.render('index', { user: req.user,paymentStatusNumber:req.user.phoneNumber})
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
  app.post('/flutterWaveSubWeek', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "1500",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
  app.post('/flutterWaveConfbWeek', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "1500",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
  app.post('/flutterWaveSubMonth', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "5000",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
  app.post('/flutterWaveConfMonth', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "5000",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
  app.post('/flutterWaveSubYear', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "50000",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
  app.post('/flutterWaveConfbYear', (req, res) => {
    var mykey = crypto.createHmac('aes-128-cbc', 'mypassword');
    var mystr = mykey.update('abc', 'utf8', 'hex')
    mystr += mykey.final('hex');
    let payload = {

      "tx_ref": mystr, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
      "amount": "50000",
      "currency": "RWF",
      "email": user.email,
      "phone_number": req.body.phone,
      "fullname": user.userName

    }
  })
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