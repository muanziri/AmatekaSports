const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave("FLWPUBK-b4e832dd01b49344a60f28cf46da952e-X", "FLWSECK-1f684f97b874e18903f92bfd5ac5ed98-X"  );
const passport = require('passport')
const multer = require('multer')
let uniqid = require('uniqid'); 
const uresad = multer();
const Readable = require('stream').Readable;
const {totheDrivers,totheDriversWhatsapp,ChangeProfilePic,DeleteFile} = require('./googleDrive')
const commentModel=require('./model/comments');
const {ClickableLink}=require('./model/ClickableLinks');
const {transferTobeneficiary} = require('./flutterWave')
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
  
  let user=req.user
  
  commentModel.find().then((comm)=>{
  recordings.find().then((recordings)=>{
  if(req.user){
    paymentMonth.find({tx_ref:user.paymentId}).then((paymentres2)=>{
        ClickableLink.find().then((response)=>{
          if(paymentres2.length >0){
            res.render('index', {  links:response,comments:comm,user: req.user,payment:paymentres2[0],stories:recordings})
           
          }else{
            new paymentMonth({
              userName:profile.displayName,
            }).save(); 
            res.render('index', {  links:response,comments:comm,user: req.user,payment:{PaymentStatus:"unpayed"},stories:recordings})
          }
        })
   }) 
  }else{
    res.render('index', { comments:comm,user:req.user,stories:recordings})
  }
}) })   
})
app.get('/Logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
app.get('/1/:Name',(req,res)=>{
  let Name=req.params.Name
  paymentWeek.findOne({userName:Name}).then((results)=>{
    paymentMonth.findOne({userName:Name}).then((results1)=>{
    paymentYear.findOne({userName:Name}).then((results2)=>{
      if(results!= null){
       let NewClicks= results.clicks+1;
       let newCash= results.CashLeft+5;
       paymentWeek.updateOne({userName:Name},{clicks:NewClicks},function(){
        paymentWeek.updateOne({userName:Name},{CashLeft:newCash},function(){
         res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        })
       })
      }else if(results1!= null){
        let NewClicks1= results1.clicks+1;
        let newCash1= results1.CashLeft+5;
        paymentMonth.updateOne({userName:Name},{clicks:NewClicks1},function(){
          paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
          res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        }) })
      }else if(results2!= null){
        let NewClicks2= results2.clicks+1;
        let newCash1= results2.CashLeft+5;
       paymentYear.updateOne({userName:Name},{clicks:NewClicks2},function(){
        paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
        res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
       })})
      }
  })})})
})
app.get('/2/:Name',(req,res)=>{
  let Name=req.params.Name
  paymentWeek.findOne({userName:Name}).then((results)=>{
    paymentMonth.findOne({userName:Name}).then((results1)=>{
    paymentYear.findOne({userName:Name}).then((results2)=>{
      if(results!= null){
       let NewClicks= results.clicks+1;
       let newCash= results.CashLeft+5;
       paymentWeek.updateOne({userName:Name},{clicks:NewClicks},function(){
        paymentWeek.updateOne({userName:Name},{CashLeft:newCash},function(){
         res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        })
       })
      }else if(results1!= null){
        let NewClicks1= results1.clicks+1;
        let newCash1= results1.CashLeft+5;
        paymentMonth.updateOne({userName:Name},{clicks:NewClicks1},function(){
          paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
          res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        }) })
      }else if(results2!= null){
        let NewClicks2= results2.clicks+1;
        let newCash1= results2.CashLeft+5;
       paymentYear.updateOne({userName:Name},{clicks:NewClicks2},function(){
        paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
        res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
       })})
      }
  })})})
})
app.get('/3/:Name',(req,res)=>{
  let Name=req.params.Name
  paymentWeek.findOne({userName:Name}).then((results)=>{
    paymentMonth.findOne({userName:Name}).then((results1)=>{
    paymentYear.findOne({userName:Name}).then((results2)=>{
      if(results!= null){
       let NewClicks= results.clicks+1;
       let newCash= results.CashLeft+5;
       paymentWeek.updateOne({userName:Name},{clicks:NewClicks},function(){
        paymentWeek.updateOne({userName:Name},{CashLeft:newCash},function(){
         res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        })
       })
      }else if(results1!= null){
        let NewClicks1= results1.clicks+1;
        let newCash1= results1.CashLeft+5;
        paymentMonth.updateOne({userName:Name},{clicks:NewClicks1},function(){
          paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
          res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        }) })
      }else if(results2!= null){
        let NewClicks2= results2.clicks+1;
        let newCash1= results2.CashLeft+5;
       paymentYear.updateOne({userName:Name},{clicks:NewClicks2},function(){
        paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
        res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
       })})
      }
  })})})
})
app.get('/4/:Name',(req,res)=>{
  let Name=req.params.Name
  paymentWeek.findOne({userName:Name}).then((results)=>{
    paymentMonth.findOne({userName:Name}).then((results1)=>{
    paymentYear.findOne({userName:Name}).then((results2)=>{
      if(results!= null){
       let NewClicks= results.clicks+1;
       let newCash= results.CashLeft+5;
       paymentWeek.updateOne({userName:Name},{clicks:NewClicks},function(){
        paymentWeek.updateOne({userName:Name},{CashLeft:newCash},function(){
         res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        })
       })
      }else if(results1!= null){
        let NewClicks1= results1.clicks+1;
        let newCash1= results1.CashLeft+5;
        paymentMonth.updateOne({userName:Name},{clicks:NewClicks1},function(){
          paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
          res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
        }) })
      }else if(results2!= null){
        let NewClicks2= results2.clicks+1;
        let newCash1= results2.CashLeft+5;
       paymentYear.updateOne({userName:Name},{clicks:NewClicks2},function(){
        paymentMonth.updateOne({userName:Name},{CashLeft:newCash1},function(){
        res.redirect('https://www.youtube.com/watch?v=mC93zsEsSrg')
       })})
      }
  })})})
})

app.get('/Admin', (req, res) => {
      const user=req.user
      paymentYear.find().then((usersYear)=>{
        paymentMonth.find().then((usersMonth)=>{
          paymentWeek.find().then((usersWeek)=>{
            UserModel.find().then((results)=>{
            ClickableLink.find().then((links)=>{
              res.render('Admindashbaord',{users:results,usersYear:usersYear,usersMonth:usersMonth,usersWeek:usersWeek,link:links})
            })
            })
       }) })})
})

app.post('/saveWhatsappNumber/:Name',(req,res)=>{
  let Name=req.params.Name
  paymentWeek.findOne({userName:Name}).then((results)=>{
    paymentMonth.findOne({userName:Name}).then((results1)=>{
    paymentYear.findOne({userName:Name}).then((results2)=>{
      if(results!= null){
        let newNumber="+25"+req.body.phone
       paymentWeek.updateOne({userName:Name},{PhoneNumber:newNumber},function(err,doc){
        if(err){
          console.log(err)
        }
       })
      }else if(results1!= null){
        let newNumber="+25"+req.body.phone
        paymentMonth.updateOne({userName:Name},{PhoneNumber:newNumber},function(err,doc){
         if(err){
           console.log(err)
         }
        })
      }else if(results2!= null){
        let newNumber="+25"+req.body.phone
       paymentYear.updateOne({userName:Name},{PhoneNumber:newNumber},function(err,doc){
        if(err){
          console.log(err)
        }
       })
      }
  })})})
})
app.get('/Advertiser',(req,res)=>{
  if(req.user){
    paymentYear.find({tx_ref:user.paymentId}).then((paymentres)=>{
      paymentMonth.find({tx_ref:user.paymentId}).then((paymentres2)=>{
        paymentWeek.find({tx_ref:user.paymentId}).then((paymentres3)=>{
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


//app.post('/SendMessageIndividual',(req,res)=>{
//let message={
//             from: 'duterestory@gmail.com', // sender address
//             to: req.body.Email, // list of receivers
//             subject: req.body.title, // Subject line
//             text: req.body.message, // plain text body
//             html: "<b>Hello world?</b>", // html body
//           }
//   main(message);
//})
app.post('/addLikes', (req, res) => {
  let userID = req.user.id;
  let d=req.body.identity;
  
  let idF=req.body.Id;

  recordings.updateOne({RecordingId:idF}, { $addToSet: { likes: userID } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  
   UserModel.findOne({userName:d}).then((results)=>{
     let newLikes = results.likes+1
     UserModel.updateOne({userName:d},{likes:newLikes},function (err, docs) {
       if (err) {
         console.log(err)
       }
     })
   })

})
app.post('/approveYear',(req,res)=>{
  let approveId=req.body.approveId
  let ida=req.body.approveIda
  let views=req.body.views
  let filter={id:approveId};
   paymentYear.findById(approveId).then((results)=>{
    let Views=results.clicks+parseInt(views)
    let newMoney=Views*5
    paymentYear.updateOne(filter,{clicks:Views},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentYear.updateOne(filter,{CashLeft:newMoney},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentYear.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
   })
   res.redirect('/Admin')
})
app.post('/Votting',(req,res)=>{
  let user=req.user
  if(req.body.Vote==0){
    req.flash('message1','shyiramo amajwi atangana na zero')
    req.redirect('/')

  
  }else{

  const rw_mobile_money =  async (payload)=>{
 
    try {
       const response =  await flw.MobileMoney.rwanda(payload)
    
     req.flash('VoteAuth',`${response.meta.authorization.redirect}`)
     res.redirect('/')
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  var mykey2 = uniqid()
  UserModel.updateOne({ userName: user.userName }, { paymentId:mykey }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
 let votes= req.body.phone
 let neWVotes=votes*50
  let payload = {
    
    "tx_ref": mykey, 
    "order_id":mykey2,//This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    "amount": neWVotes,
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": 'none'

  }
  console.log(req.user.userName)
  rw_mobile_money(payload)}
})
app.post('/abortYear',(req,res)=>{
  let approveId=req.body.abortId
  let ida=req.body.abortIda
  let filter={id:approveId};
  paymentYear.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
    if(err)throw err
    console.log('done')
  })
  DeleteFile(ida)
  res.redirect('/Admin')
})
app.post('/approveMonth',(req,res)=>{
  let approveId=req.body.approveId
  let ida=req.body.approveIda
  let views=req.body.views
  let filter={id:approveId};
   paymentMonth.findById(approveId).then((results)=>{
    let Views=results.clicks+parseInt(views)
    let newMoney=Views*5
    paymentMonth.updateOne(filter,{clicks:Views},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentMonth.updateOne(filter,{CashLeft:newMoney},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentMonth.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
   })
   res.redirect('/Admin')
 })
 app.post('/abortMonth',(req,res)=>{
  let approveId=req.body.abortId
  let ida=req.body.abortIda
  let filter={id:approveId};
  paymentMonth.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
    if(err)throw err
    console.log('done')
  })
  DeleteFile(ida)
  res.redirect('/Admin')
 })
 app.post('/NewUrlTobeShared',(req,res)=>{
  ClickableLink({
    link:req.body.NewUrlTobeSharedred,
    Discription:req.body.DescriptionH
  }).save();
  res.redirect('/Admin')

 })
 app.post('/DeleteTheLink',(req,res)=>{
  let id=req.body.identify
  ClickableLink.findByIdAndDelete(id,function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
      res.redirect('/Admin');
    }
});

 })
 app.post('/DeleteTheUser',(req,res)=>{
  ClickableLink({
    link:req.body.NewUrlTobeSharedred,
    Discription:req.body.DescriptionH
  }).save();

 })
 app.post('/approveWeek',(req,res)=>{
  let approveId=req.body.approveId
  let ida=req.body.approveIda
  let views=req.body.views
  let filter={id:approveId};
   paymentWeek.findById(approveId).then((results)=>{
    let Views=results.clicks+parseInt(views)
    let newMoney=Views*5
    paymentWeek.updateOne(filter,{clicks:Views},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentWeek.updateOne(filter,{CashLeft:newMoney},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
    paymentWeek.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
      if(err)throw err
      console.log('done')
    })
   })
   res.redirect('/Admin')
 })
 app.post('/abortWeek',(req,res)=>{
  let approveId=req.body.abortId
  let ida=req.body.abortIda
  let filter={id:approveId};
  paymentWeek.updateOne(filter,{$pull :{WhatsappScreenShotPosts:ida}},(err,doc)=>{
    if(err)throw err
    console.log('done')
  })
  DeleteFile(ida)
  res.redirect('/Admin')
 })
app.post('/addComments', (req, res) => {
   let Profile=req.user.ProfilePhotoUrl;
   let Name=req.user.userName;
   let id=req.body.RecordingId;
   let Comment=req.body.comment
   new commentModel({
    RecorderId:id,
    userName:Name,
    userProfile:Profile,
     links:res,Comments:Comment
   }).save()
  
})
app.post('/flutterWaveSubWeek', (req, res) => {
  
  const rw_mobile_money =  async (payload)=>{
 
    try {
       const response =  await flw.MobileMoney.rwanda(payload)
    
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
    "amount": "500",
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
    
     req.flash('messageURL',`${response.meta.authorization.redirect}`)
     res.redirect('/')
    } catch (error) {
        console.log(error)
    }                            
   
}
  var mykey = uniqid()
  var mykey2 = uniqid()
  
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

app.post('/FromWhatsapp',uresad.any(),(req,res)=>{
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
      req.flash('message1','Ntiwatoye Antabwo ijwi ryawe ntiribarwa')
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
app.get('/Votting_CallBack/:userId', async (req, res) => {
  let userID=req.params.userId
  let user=req.user
   const transactionDetailsM = await UserModel.find({paymentId:user.paymentId});
   if (transactionDetailsM.length >0){
      const responseM= await flw.Transaction.verify({id:transactionDetailsM[0].paymentId});
      if(responseM.message=="No transaction was found for this id" || responseM.status=="failed"){
       req.flash('message1','Ntiwishyuye Antabwo ijwi ryawe ntiribarwa')
       res.redirect('/')
     }else{
      UserModel.findById(userID).then((results)=>{
        let NewVotes=results.Votes+1
        UserModel.updateOne({ paymentId: results.paymentId }, { Votes:NewVotes }, function (err, docs) {
          if (err) {
            console.log(err)
          }
        })
        recordings.updateOne({ userId: results.id }, { Votes:NewVotes }, function (err, docs) {
          if (err) {
            console.log(err)
          }
          req.flash('message1','Urakoze kwishyura Muryoherwe Na Cash')
          res.redirect('/')
        })
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
    "amount": "10000",
    "currency": "RWF",
    "email":"munaziribnm@gmail.com",
    "phone_number": req.body.phone,
    "fullname": req.user.userName

  }
  rw_mobile_money(payload)
})


app.post('/flutterWaveWithDraw', (req, res) => {
   
  let kid=req.body.kid.trim();
  let amount=req.body.Amount
  console.log(kid)
  
    paymentMonth.find({tx_ref:kid}).then((paymentres2)=>{
     
       if (paymentres2.length >0){
      let ceck=paymentres2[0].CashLeft-amount
        if (ceck>0){
          let payload = {
    
     account_bank: "MPS",
        account_number: req.user.phoneNumber.paymentres2slice(1),
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
          req.flash('message1',`Kubikuza ${amount} byarangiye niba ugiza ikibazo hamagara kuri +250709457824`);
          res.redirect('/');
          paymentMonth.findByIdAndDelete(paymentres2.id).then(()=>{
            console.log('deleted')
          })
        }else{ 
        req.flash('message1',`Bikuza atari hejuru yayo wakoreye,Wakoreye ${paymentres[0].CashLeft}RWF,ibyo bindi n' ubujura, tuzafunga account yawe niwongera`);
        res.redirect('/');
      }
    }
   }) })
app.post('/addViews', (req, res) => {
  let Recordingid = req.body.audioTitleViews;
  let UserName = req.body.audioTitleViews2;
  
  recordings.findOne({ RecordingId: Recordingid }).then((results) => {
    let newViews = results.views+1
    recordings.updateOne({ RecordingId: Recordingid }, { views: newViews }, function (err, docs) {
      if (err) {
        console.log(err)
      }
    })
  })
  UserModel.findOne({userName:UserName}).then((results)=>{
    let newViews = results.Views+1
    
    UserModel.updateOne({userName:UserName},{Views:newViews},function (err, docs) {
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
app.post('/ChangeProfilePic',uresad.any(),(req,res)=>{
  const user = req.user;
  const originalname=req.user.userName
  var folderId = user.folderId;
  var fileMetadata = {
    'name': [originalname],
    parents: [folderId]
  };
  var media = {
    mimeType: req.files[0].mimetype,
    body: bufferToStream(req.files[0].buffer)
  };
  ChangeProfilePic(fileMetadata,media,user);
})
app.post('/ToTheDrive', uresad.any(), (req, res,next) => {
  const user = req.user;
  let files =req.files.reverse()[0];
  let RecordTitle=req.body.Title;
  let NewsBody=req.body.Title2;
  let filepath = "./audioUresads/";
  let originalname = files.originalname + '.aac'
  let stringedFilePath = filepath + originalname;
  var folderId = user.folderId;
  var fileMetadata = {
    'name': [originalname],
    parents: [folderId]
  };
  var media = {
    mimeType: 'audio/aac',
    body: bufferToStream(files.buffer)
  };

  totheDrivers(fileMetadata, media,RecordTitle, stringedFilePath, user, folderId,NewsBody);
  next();

})




const port = process.env.PORT || 3330
app.listen(port, () => {
  console.log('heard from port')
})