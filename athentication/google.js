const passport2=require('passport');

const usersClients=require('../model/UserModel')
//require('dotenv').config();

var GoogleStrategy2 = require( 'passport-google-oauth2' ).Strategy;

passport2.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport2.deserializeUser((id,done)=>{
  
  usersClients.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var GOOGLE_CLIENT_ID='448449300588-db11tbg1iofdtq7lqt8e90qs6er688sv.apps.googleusercontent.com'
var GOOGLE_CLIENT_SECRET='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'
passport2.use(new GoogleStrategy2({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://isp-final.herokuapp.com/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      
    usersClients.findOne({AuthId:profile.id}).then((currentUser)=>{
    
      if(currentUser){
         console.log('u are loged in as '+currentUser.userName);
         done(null,currentUser);
      }else{
        new usersClients({
          userName:profile.displayName,
          Email:profile.email,
          AuthId:profile.id,
          ProfilePhotoUrl:profile.picture
        }).save().then((user1)=>{
          done(null,user1)
        })
      } 
  
    })

  
  }
));













