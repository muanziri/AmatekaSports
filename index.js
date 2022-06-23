const express=require('express')
const mongoose=require('mongoose')
const session= require('express-session')
const flash=require('flash')
const passport=require('passport')
const multer=require('multer')
const upload=multer();
const Readable = require('stream').Readable; 
const {totheDrivers}=require('./googleDrive')
const userModel=require('./model/users');
require('./athentication/google')


const DB="mongodb+srv://DutereStory:DutereStory@cluster0.zo6ti8b.mongodb.net/DutereStory1?retryWrites=true&w=majority";
mongoose.connect(DB,{ useNewUrlParser:true,useUnifiedTopology:true})
  .then((results)=>{

    
   console.log('connected....');
  })
  .catch((err)=>{
      console.warn(err)
  })
 
function bufferToStream(buffer) { 
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
const app=express()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret: 'keyboard.com',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:1000*60*60*24 }
}))
  app.use(flash())
app.set('view engine','ejs');
app.use('/static',express.static(__dirname+'/static'))
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get( '/google/auth/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get('/auth/google/success',(req,res)=>{
  res.redirect('/')
})
app.get('/',(req,res)=>{
     console.log(req.user)
    res.render('index',{user:req.user})

    
})
app.post('/addLikes',(req,res)=>{
  
 
})
app.post('/addClicks',(req,res)=>{

 
})
app.post('/addComments',(req,res)=>{
 

 
})
app.post('/addViews',(req,res)=>{
 
 
})
app.post('/ToTheDrive',upload.any(), (req,res)=>{
    
      const user=req.user;
    let files=req.files;
    console.log(files)
  //   let filepath="./audioUploads/";
  //   let originalname=files[0].originalname+'.aac'
  //   let stringedFilePath=filepath+originalname;
  //  var folderId = user.folderId;
  // var fileMetadata = {
  //       'name': [originalname],
  //       parents: [folderId]
  //     };
  //     var media = {
  //           mimeType: 'audio/aac',
  //          body: bufferToStream(req.file[0].buffer)
  //         };  
    
  //  totheDrivers(fileMetadata,media,stringedFilePath,user,folderId);
  //  res.redirect('/');
    
    
})




const port= process.env.PORT||3300
app.listen(port,()=>{
    console.log('heard from port')
})