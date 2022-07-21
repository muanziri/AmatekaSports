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
app.get('/5/:Name',(req,res)=>{
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
app.get('/6/:Name',(req,res)=>{
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
app.get('/7/:Name',(req,res)=>{
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
app.get('/8/:Name',(req,res)=>{
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
app.get('/9/:Name',(req,res)=>{
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
app.get('/10/:Name',(req,res)=>{
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
app.get('/11/:Name',(req,res)=>{
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
app.get('/12/:Name',(req,res)=>{
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
app.get('/13/:Name',(req,res)=>{
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
app.get('/14/:Name',(req,res)=>{
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
app.get('/15/:Name',(req,res)=>{
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
app.get('/16/:Name',(req,res)=>{
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
app.get('/17/:Name',(req,res)=>{
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
app.get('/18/:Name',(req,res)=>{
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
app.get('/19/:Name',(req,res)=>{
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
app.get('/20/:Name',(req,res)=>{
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
  
      paymentYear.find({tx_ref:user.paymentId}).then((usersYear)=>{
        paymentMonth.find({tx_ref:user.paymentId}).then((usersMonth)=>{
          paymentWeek.find({tx_ref:user.paymentId}).then((usersWeek)=>{
            res.render('Admindashbaord',{usersYear:usersYear,usersMonth:usersMonth,usersWeek:usersWeek})
       
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

app.get('/refferal/:userName',(req,res)=>{
  userName=req.params.userName;

})
app.post('/addLikes', (req, res) => {
  let userID = req.user.id
  let d=req.body.identity
  recordings.updateOne({UserName:d}, { $addToSet: { likes: userID } }, function (err, docs) {
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

app.post('/addComments', (req, res) => {
   let Profile=req.user.ProfilePhotoUrl;
   let Name=req.user.userName
   let comment=req.body.comment
   let filter={RecordingId:req.body.recId}
  recordings.updateOne(filter, { $addToSet: { profileComment: Profile } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  recordings.updateOne(filter, { $addToSet: { NameComment: Name } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
  recordings.updateOne(filter, { $addToSet: { Comment: comment } }, function (err, docs) {
    if (err) {
      console.log(err)
    }
  })
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
   paymentYear.find({tx_ref:kid}).then((paymentres)=>{
    paymentMonth.find({tx_ref:kid}).then((paymentres2)=>{
      paymentWeek.find({tx_ref:kid}).then((paymentres3)=>{
       if (paymentres.length >0){
      let ceck=paymentres[0].CashLeft-amount
        if (ceck>0){
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
          req.flash('message1',`Kubikuza ${amount} byarangiye niba ugiza ikibazo hamagara kuri +250709457824`);
          res.redirect('/');
        }else{ 
        req.flash('message1',`Bikuza atari hejuru yayo wakoreye,Wakoreye ${paymentres[0].CashLeft}RWF,ibyo bindi n' ubujura, tuzafunga account yawe niwongera`);
        res.redirect('/');
      }
    }else if(paymentres2.length >0){
      let ceck=paymentres2[0].CashLeft-amount
      if (ceck>0){
       
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
  req.flash('message1',`Kubikuza ${amount} byarangiye niba ugiza ikibazo hamagara kuri +250709457824`);
  res.redirect('/');
      }else{req.flash('message1',`Bikuza atari hejuru yayo wakoreye,Wakoreye ${paymentres2[0].CashLeft}RWF,ibyo bindi n' ubujura, tuzafunga account yawe niwongera`);
      res.redirect('/');}
    }else if(paymentres3.length >0){
     let  ceck=paymentres3[0].CashLeft-amount
     if (ceck>0){
      
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
  req.flash('message1',`Kubikuza ${amount} byarangiye niba ugiza ikibazo hamagara kuri +250709457824`);
  res.redirect('/');
    }else{req.flash('message1',`Bikuza atari hejuru yayo wakoreye,Wakoreye ${paymentres3[0].CashLeft}RWF,ibyo bindi n' ubujura, tuzafunga account yawe niwongera`);
    res.redirect('/');}
    }
   }) })})
  
})
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

app.post('/ToTheDrive', upload.any(), (req, res,next) => {
  const user = req.user;
  let files =req.files.reverse()[0];
  let RecordTitle=req.body.Title;
  let filepath = "./audioUploads/";
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

  totheDrivers(fileMetadata, media,RecordTitle, stringedFilePath, user, folderId);
  next();

})




const port = process.env.PORT || 3300
app.listen(port, () => {
  console.log('heard from port')
})