const passport=require('passport');
const { google } = require('googleapis');
var drive = google.drive("v3");

const {UserModel}=require('../model/users');
const key= require('../duterestory-ecc42c3b6063.json');
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } })
//require('dotenv').config();

const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;

passport.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport.deserializeUser((id,done)=>{
  
  UserModel.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var GOOGLE_CLIENT_ID='79374043564-c8luht2492rlm4la2tdpvuv9h5ctcvuk.apps.googleusercontent.com'
var GOOGLE_CLIENT_SECRET='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'
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://dutere-story.herokuapp.com/google/auth/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {

  

    
    

 
    UserModel.findOne({AuthId:profile.id}).then((currentUser)=>{
      if(currentUser){
        console.log('u are loged in as '+currentUser.userName);
        done(null,currentUser);
     }else{
      var folderId = "1WhwVTQycr7uyO2r_kiGPE38VunkC-njB";
      var folderName=profile.displayName   
      var fileMetadataa = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            parents: [folderId]
      }
         const uploadToTheDriveMakeFOlder= (fileMetadata)=>{
       
            // console.log(file)
           
    
             
                drive.files.create({
                  auth: jwToken,
                  resource: fileMetadata,
                  fields: 'id'
                }, function(err, file) {
                  if (err) {
                    // Handle error
                    console.error(err);
                  } else {
               
                new UserModel({
                  userName:profile.displayName,
                  Email:profile.emails[0].value,
                  AuthId:profile.id,
                  ProfilePhotoUrl:profile.photos[0].value,
                  folderId:file.data.id
                }).save().then((user1)=>{
                  done(null,user1)
                })
              } 
          
            })
        
        }
        uploadToTheDriveMakeFOlder(fileMetadataa);
      }});

      
  
      
  
  
      }));













