
//Randomly assign a time signature

// timeSig of 0 means 3/4; timeSig of 1+ means 4/4

var timeSig = Math.floor(Math.random() * 2);

if (timeSig < 1) {

  NOTES = [55, 55, 57, 55, 60, 59,
    55, 55, 57, 55, 62, 60,
    55, 55, 67, 64, 60, 59, 57,
    65, 65, 64, 60, 62, 60];

  DELAYS = [3, 1, 4, 4, 4, 8,
    3, 1, 4, 4, 4, 8,
    3, 1, 4, 4, 4, 4, 4,
    3, 1, 4, 4, 4, 8];
} else {
  NOTES = [55, 55, 57, 55, 60, 59,
    55, 55, 57, 55, 62, 60,
    55, 55, 67, 64, 60, 59, 57,
    65, 65, 64, 60, 62, 60];

  DELAYS = [3, 1, 4, 8, 4, 12,
    3, 1, 4, 8, 4, 12,
    3, 1, 4, 8, 4, 4, 8,
    3, 1, 4, 8, 4, 12];
}

const BPM_LOWER_BOUND = 30;
const BPM_UPPER_BOUND = 300;

//need 55 random codes

//var bpm = (BPM_LOWER_BOUND + BPM_UPPER_BOUND)/2
var bpm = Math.floor(Math.random() * (BPM_UPPER_BOUND - BPM_LOWER_BOUND) + BPM_LOWER_BOUND);
/* If using slider, uncomment
var sliderRate = document.getElementById("rate");
sliderRate.oninput = function() {
  bpm = this.value
}
*/

MIDI.USE_XHR = false;

MIDI.loadPlugin({
  soundfontUrl: "scripts/soundfont/",
  instrument: "acoustic_grand_piano",
  onprogress: function(state, progress) {
  	//console.log(state, progress);
  },
  onsuccess: function() {
  	//console.log("finished loading")
  }
});

var noteCounter = 0
var on = false;

function togglePlay(){
  if (!on) play()
  else if (on){
    clearInterval(currTrack);
    on = false;
  }
}

function play()
{
  if (noteCounter < 26){
    on = true;
    noteDur_SECONDS = DELAYS[noteCounter]* (15/bpm);
    noteDur_MILLISECONDS = noteDur_SECONDS * 1000;

    //logging; uncomment for debugging
    //console.log("BPM: " + bpm)


    currTrack = window.setTimeout(play, noteDur_MILLISECONDS);
    playNote(NOTES[noteCounter], noteDur_SECONDS);
    noteCounter += 1;
  }

  if (noteCounter == 26){
    noteCounter = 0;
    /* If you want to stop after song finishes instead of looping, uncomment
    clearInterval(currTrack);
    on = false;
    */
  }
}

function playNote(note, noteDur){
	MIDI.noteOn(0, note, 200, 0);
	MIDI.noteOff(0,note, noteDur);
}

function changeSpeed(amt){
  if (amt == -2) bpm -= 10;
  if (amt == -1) bpm -= 5;
  if (amt == 1) bpm += 5;
  if (amt == 2) bpm += 10;

  checkBounds()
}

function checkBounds(){
  if (bpm < BPM_LOWER_BOUND) bpm = BPM_LOWER_BOUND;
  if (bpm > BPM_UPPER_BOUND) bpm = BPM_UPPER_BOUND;
}

function submit(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  text += ("0000" + bpm + "00" + timeSig).slice(-6)
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  //console.log(text);
  document.getElementById("code").innerHTML = text;
  document.getElementById("submit").style.display = "block";
}
