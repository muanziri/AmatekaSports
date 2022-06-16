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
		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

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
			document.getElementById('time').innerText = timeInSeconds;
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
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML="Pause";
	//timmer stop
	timer.reset();
	timer.stop();
	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();
   // change the animation
   document.getElementById('imageRecoding').setAttribute('src','../static/img/gifs/NoAnimatio.jpg')
	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}


function createDownloadLink(blob) {
	//console.log(blob)

    

	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	
	//name of .wav file to use during upload and download (without extendion)
	var filename = Date.now();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	

	//add the new audio element to li
	li.appendChild(au);
	
	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);
	var comfirmHeader = document.createElement('h3');
	comfirmHeader.innerHTML = "uploaded";
	comfirmHeader.style.display='none'
	//upload link
    var progress = document.createElement('progress');
	progress.id="progressBar"
	progress.value='0'
	progress.max='50'
	progress.style.display='none'
    li.appendChild(progress)

	var progress2 = document.createElement('progress');
	progress2.id="progressBar2"
	progress2.value='0'
	progress2.max='50'
	progress2.style.display='none'
    li.appendChild(progress2)

	var timeleft = 50;
	var timeleft2 = 50;
	
	function startProgressBar(){

    var downloadTimer = setInterval(function(){
      if(timeleft <= 0 ){
        clearInterval(downloadTimer);
		uploadButton.style.display = "block";
		progress.style.display='none';
      }
      document.getElementById("progressBar").value = 50 - timeleft;
      timeleft -= 1;
     
    }, 1000);
   
       }
	   function startProgressBar2(){

		var downloadTimer = setInterval(function(){
		  if(timeleft2 <= 0 ){
			clearInterval(downloadTimer);
			comfirmHeader.style.display = "block";
			progress2.style.display='none';
		  }
		  document.getElementById("progressBar2").value = 90 - timeleft2;
		  timeleft2 -= 1;
		 
		}, 1000);
	   
		   }  

	var uploadButton = document.createElement('button');


	uploadButton.href="#";
	uploadButton.id="uploadButtonId"
	uploadButton.setAttribute("class", "uploadButton");
	uploadButton.style.display = "none";
	uploadButton.innerHTML = "upload";
	uploadButtonId=document.getElementById('uploadButtonId')
     uploadButton.addEventListener('click',function (events) {
		uploadButton.style.display = "none";
	    document.getElementById('progressBar2').style.display='block'
		startProgressBar2()
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
	
	li.appendChild(uploadButton)
    
	var innitiate = document.createElement('button');

	innitiate.href="#";
	innitiate.id="innitiateId"
	innitiate.setAttribute("class", "innitiate");
	innitiate.innerHTML = "innitiate";
	innitiateId=document.getElementById('innitiateId')
	innitiate.addEventListener('click',function (events) {
		document.getElementById('progressBar').style.display='block'
		startProgressBar();
		innitiate.style.display='none'
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
	li.appendChild(innitiate)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li)


}
 