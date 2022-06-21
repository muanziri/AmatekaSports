
const { google } = require('googleapis');
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
  const totheDrivers= (fileMetadata,media,stringedFilePath,user,folderId)=>{
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
       new UserRecording({
         UserName:user.userName,
         ProfilePic:user.ProfilePhotoUrl,
         FolderId:folderId
       }).save().then((results)=>{
         console.log('he is saved')
       })
       fs.unlink(stringedFilePath,()=>{
         console.log("deleted")
       })
     }
   });
   }
   module.exports=totheDrivers;