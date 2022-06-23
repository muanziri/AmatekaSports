//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
class Timer {
	constructor () {
	  this.isRunning = false;
	  this.startTime = 0;
	  this.overallTime = 0;
	}
  
	_getTimeElapsedSinceLastStart () {
	  if (!this.startTime) {
		return 0;
	  }
	
	  return Date.now() - this.startTime;
	}
  
	start () {
	  if (this.isRunning) {
		return console.error('Timer is already running');
	  }
  
	  this.isRunning = true;
  
	  this.startTime = Date.now();
	}
  
	stop () {
	  if (!this.isRunning) {
		return console.error('Timer is already stopped');
	  }
  
	  this.isRunning = false;
  
	  this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
	}
  
	reset () {
	  this.overallTime = 0;
  
	  if (this.isRunning) {
		this.startTime = Date.now();
		return;
	  }
  
	  this.startTime = 0;
	}
  
	getTime () {
	  if (!this.startTime) {
		return 0;
	  }
  
	  if (this.isRunning) {
		return this.overallTime + this._getTimeElapsedSinceLastStart();
	  }
  
	  return this.overallTime;
	}
  }
  const timer = new Timer(); 
 
function startRecording() {
	document.getElementById('BTN2').style.display="block";
	document.getElementById('recordButton').style.display="none";
	document.getElementById('ReacorderBTN').style.display="block";
	
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		 
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
       
		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1})
         
		//start timmer
	
		  
		  
		  timer.start();
		
		  setInterval(() => {
			const timeInSeconds = Math.round(timer.getTime() / 1000);
			document.getElementById('time67').innerText = timeInSeconds;
		  }, 100)
		//start the recording process
		rec.record()
       //change Image
	   document.getElementById('imageRecoding').setAttribute('src','../static/img/gifs/6ba174bf48e9b6dc8d8bd19d13c9caa9.gif')
		console.log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause timer
		timer.stop();
		//pause
		rec.stop();
	
	}else{
		//resume
		timer.start();
		rec.record()
	

	}
}

function stopRecording() {
	console.log("stopButton clicked");
    document.getElementById("recordingsList").style.display="block";
	document.getElementById('ReacorderBTN').style.display="none";
	document.getElementById('BTN7').style.display="block";
	document.getElementById('BTN2').style.display="none";
	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	
	//timmer stop
	timer.reset();
	timer.stop();
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();
   // change the animation
   
	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}


function createDownloadLink(blob) {
	//console.log(blob)

    
   var recordingsList=document.getElementById("recordingsList")
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	
	//name of .wav file to use during upload and download (without extendion)
	var filename = Date.now();
    au.style.color='teal'
	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	

	//add the save to disk link to li
	li.appendChild(link);
	var comfirmHeader = document.createElement('h3');
	comfirmHeader.innerHTML = "uploaded";
	comfirmHeader.style.display='none'
	//upload link
    
   
    

	var uploadButton = document.getElementById('BTN7');


	 uploadButton.addEventListener('click',function (events) {
		
	   
		
	 	var xhr=new XMLHttpRequest();
	 	xhr.onload=function(e) {
	 		if(this.readyState === 4) {
	 			console.log("Server returned: ",e.target.responseText);
	 		}
	 	};
	 	var fd=new FormData();
	 	fd.append("audio_data",blob, filename);
	 	xhr.open("POST","ToTheDrive",true);
	 	xhr.send(fd);
	 })
	
	
    


	li.appendChild(document.createTextNode (" "))//add a space in between
	//li.appendChild(innitiate)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li)


}
 