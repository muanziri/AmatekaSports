
const { google } = require('googleapis');
const users=require('./model/users')
const recordings=require('./model/recordings')
const key= require('./duterestory-ecc42c3b6063.json')
var drive = google.drive("v3");
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
    } else {
      console.log("Authorization accorded");
    }
  });
  const totheDrivers= (fileMetadata,media,stringedFilePath,user,folderIda)=>{
    drive.files.create({
     auth: jwToken,
     resource: fileMetadata,
     media: media,
     fields: 'id',
     onUploadProgress: evt => {
      const progress = (evt.bytesRead / fileSize) * 100;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${Math.round(progress)}% complete`);
    },
   }, function(err, file) {
     if (err) {
       // Handle error
       console.error(err);
     } else {
      
       console.log('File Id: ', file.data.id);
       console.log(user.id)
    users.findByIdAndUpdate(user.id,{$addToSet:{Recordings:file.data.id}},function (err, docs) {
      if (err){
          console.log(err)
      }
  })
    
     }
   });
   }
   module.exports=totheDrivers;