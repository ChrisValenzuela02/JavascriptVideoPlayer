// Declare Variables
var video, videoContainer, buttonBar, playButton, muteButton, fullScreenButton, ccButton, progressBar, seekbar, volumeBar, currentTimeText, durationTimeText, buttonControls;
var isFullScreenEnabled = false; var isCCEnabled = false;
var transcript;
var transcriptSpan;

// Initialize variables and player
function initializeVideoPlayer(){
	video = document.getElementById("video");
	videoContainer = document.getElementById("video-container");
	buttonControls = document.getElementById("control-buttons");
	buttonBar = document.getElementById("buttonbar");
	playButton = document.getElementById("play");
	muteButton = document.getElementById("mute");
	ccButton = document.getElementById("captionsBtn");
	fullScreenButton = document.getElementById("fullScreen");
	seekbar = document.getElementById("seekbar");
	progressBar = document.getElementById("progress-bar");
	volumeBar = document.getElementById("volume");
	currentTimeText = document.getElementById("currentTimeText");
	durationTimeText = document.getElementById("durationTimeText");
	transcript = document.getElementById("transcript");
	transcriptSpan = transcript.getElementsByTagName("span");
	
	playButton.addEventListener("click", play, false);
	muteButton.addEventListener("click", mute, false);
	ccButton.addEventListener("click", toggleCaptions, false);
	fullScreenButton.addEventListener("click", toggleFullScreen, false);
	seekbar.addEventListener("change", seek, false);
	volumeBar.addEventListener("change", setVolume, false);
	video.addEventListener("click", play, false);
 	video.addEventListener("timeupdate", seekTimeUpdate, false);
 	video.addEventListener("timeupdate", updateTimeBar, false);
	video.addEventListener("dblclick", toggleFullScreen, false);
	video.addEventListener("mouseover", showControlsHover, false);
	video.addEventListener("mouseout", hideControlsHover, false);
	videoContainer.addEventListener("mouseover", showControlsHover, false);
	videoContainer.addEventListener("mouseout", hideControlsHover, false);
	video.addEventListener("ended", restartVideo, false);

}
window.onload = initializeVideoPlayer;

// Displays controls when video is playing and mouse hovers over.
function showControlsHover(){
  if (!video.paused && isFullScreenEnabled === false){
    buttonControls.style.display = "block";
    buttonBar.style.bottom = "13px";
    progressBar.style.opacity = "1";
  }
}

// Hides controls when mouse out.
function hideControlsHover(){
    if (!video.paused && isFullScreenEnabled === false){
    buttonControls.style.display = "none";
    progressBar.style.opacity = "0.5";
  }
}

// Plays video when video or play button is pressed.
function play() {
   if (video.paused) {
	  video.play();
	  document.getElementById("playBtnImg").src = "icons/pause-icon.png";
   }
   else {
	  video.pause();
	  document.getElementById("playBtnImg").src = "icons/play-icon.png";
   }
}

// Mutes audio when button is pressed or when volume slider reaches 0 (mute).
function mute(){
    if (video.muted && volumeBar.value == 0) {
	  video.muted = false;
	  document.getElementById("muteBtnImg").src = "icons/volume-on-icon.png";
	  volumeBar.value = video.volume;
   } else if(video.muted == false && volumeBar.value != 0){
	  video.muted = true;
	  document.getElementById("muteBtnImg").src = "icons/volume-off-icon.png";
	  volumeBar.value = "0";
   }
}

// Enables or disables captions/subtitles.
function toggleCaptions(){
  if(isCCEnabled === false){
    isCCEnabled = true;
    video.textTracks[0].mode = "showing";
    ccButton.style.textDecoration = "line-through";
  }
    else if(isCCEnabled === true){
    isCCEnabled = false;
    video.textTracks[0].mode = "hidden";
    ccButton.style.textDecoration = "none";
  }
}

//Toggles fullscreen view when button is pressed, video is double-clicked, or esc key is pressed.
function toggleFullScreen() {
	$(document).keyup(function(e) {
		isFullScreenEnabled = false;
		buttonBar.style.bottom = "15px";
		if (e.keyCode === 27) { // escape key maps to keycode `27`
		if(document.cancelFullScreen) { document.cancelFullScreen(); }
		else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
		else if(document.webkitCancelFullScreen) { document.webkitCancelFullScreen(); }
		}
	});
	
	if(isFullScreenEnabled === false){
		isFullScreenEnabled = true;
		buttonBar.style.right = "5px";
		if(video.requestFullScreen) { video.requestFullScreen(); }
		else if(video.msRequestFullscreen) { video.msRequestFullscreen(); }
		else if(video.mozRequestFullScreen) { video.mozRequestFullScreen(); }
		else if(video.webkitRequestFullScreen) { video.webkitRequestFullScreen(); }
	}
	
	else{
		isFullScreenEnabled = false;
		buttonBar.style.bottom = "15px";
		if(document.cancelFullScreen) { document.cancelFullScreen(); }
		else if(document.msExitFullscreen) { document.msExitFullscreen(); }
		else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
		else if(document.webkitCancelFullScreen) { document.webkitCancelFullScreen(); }
		}
}

//Updates video time to where seekbar is seeked to.
function seek(){
    var seekTo = video.duration * (seekbar.value / 100);
  	video.currentTime = seekTo;
}

//Updates current time and duration of video span class.
function seekTimeUpdate(){
    var newTime = video.currentTime * (100 / video.duration);
  	progressBar.value = newTime;
  	var currentMinutes = Math.floor(video.currentTime / 60);
  	var currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
  	var durationMinutes = Math.floor(video.duration / 60);
  	var durationSeconds = Math.floor(video.duration - durationMinutes * 60);

  	if(currentSeconds < 10){currentSeconds = "0" + currentSeconds;}
  	if(durationSeconds < 10){durationSeconds = "0" + durationSeconds;}
    if(currentMinutes < 10){currentMinutes = "0" + currentMinutes;}
  	if(durationMinutes < 10){durationMinutes = "0" + durationMinutes;}
  	currentTimeText.innerHTML = currentMinutes + ":" + currentSeconds + "&nbsp; /";
  	durationTimeText.innerHTML = durationMinutes + ":" + durationSeconds;
}

// Fills progress bar as time elapses and highlights transcript as video plays.
function updateTimeBar(){
	var updateBar = seekbar;
	var percentage = Math.floor((100 / video.duration) * video.currentTime);
	updateBar.value = percentage;
	
var now = video.currentTime;
for(var i = 0; i < transcriptSpan.length; i++) {
		  if ( now >= parseInt(transcriptSpan[i].dataset.start) && now <= parseInt(transcriptSpan[i].dataset.end) ) {
		    transcriptSpan[i].className = "currentText";
		  } else {
		    transcriptSpan[i].className = "";
		  }
		}
}

// Adjusts volume depending on position of volume bar.
function setVolume(){
  video.muted = false;
	document.getElementById("muteBtnImg").src = "icons/volume-on-icon.png";
  video.volume = volumeBar.value;
  
  if(volumeBar.value == 0){
    document.getElementById("muteBtnImg").src = "icons/volume-off-icon.png";
  }
}

// Starts video over once it has completed.
function restartVideo(){
  if(video.ended){
    video.currentTime = 0;
    buttonControls.style.display = "block";
    buttonBar.style.bottom = "15px";
    progressBar.style.opacity = "1";
    document.getElementById("playBtnImg").src = "icons/play-icon.png";
  }
}
