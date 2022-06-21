const express=require('express')
const mongoose=require('mongoose')
const session=require('express-session')
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
  secret: 'somethingsecretgoeshere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
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
    console.log(req.session)
    res.render('index',{user:req.user})

    
})
app.post('/ToTheDrive',upload.any(), (req,res)=>{
    
      const user=req.user
    let files=req.files
    let filepath="./audioUploads/";
    let originalname=files[0].originalname+'.aac'
    let stringedFilePath=filepath+originalname;
   var folderId = "1WhwVTQycr7uyO2r_kiGPE38VunkC-njB";
  var fileMetadata = {
        'name': [originalname],
        parents: [folderId]
      };
      var media = {
            mimeType: 'audio/aac',
           body: bufferToStream(req.file.buffer)
          };  
    
   totheDrivers(fileMetadata,media,stringedFilePath,user,folderId)
    
    
})

// app.post('/PodcastControl',(req,res)=>{
//   var jwToken = new google.auth.JWT(
//       key.client_email,
//       null,
//       key.private_key, ["https://www.googleapis.com/auth/drive"],
//       null
//     );
//     jwToken.authorize((authErr) => {
//       if (authErr) {
//         console.log("error : " + authErr);
//         return;
//       } 
//     });

//     const uploadToTheDriveMakeFOlder= (fileMetadata)=>{
//       drive.files.create({
//         auth: jwToken,
//         resource: fileMetadata,
//         fields: 'id'
//       }, function(err, file) {
//         if (err) {
//           // Handle error
//           console.error(err);
//         } else {
//           let fileId=file.data.id
//           req.flash('message','Now Record the first espode');
//           req.flash('Id',fileId);
//           req.flash('playName',req.body.PlayName);
//           let name=req.body.PlayName;
//           let Season=req.body.Season;
//           let discrition=req.body.SeasonDiscription
//          new genesis({
//            PlayNames:name,
//            seasonNumber:Season,
//            PlayDiscription:discrition,
//            FolderId:fileId
//          }).save().then((results)=>{
//          }).catch((err)=>{
//              if (err) throw err;
//          })
//           res.redirect('/PodcastControl')
          
          
//         }
//       });
//       }
  


// var folderId = "1WFFcWOU-EvMGWhp7_SSlsaXdp-e5dSEs";
// var folderName=req.body.PlayName+" S "+req.body.Season   
// var fileMetadata = {
//       'name': folderName,
//       'mimeType': 'application/vnd.google-apps.folder',
//       parents: [folderId]
//      };
//      function funct(fileId){
//       console.log(fileId)
//      }
//     })



const port= process.env.PORT||3300
app.listen(port,()=>{
    console.log('heard from port')
})