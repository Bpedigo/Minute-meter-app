//global variables
let counterArray = [];
let clockArray = [];
const chime = new Audio("http://www.wavlist.com/soundfx/030/synthesizer03.wav");
const facade = document.querySelector(".facade");
const clockFace = document.querySelector(".clockFace");


// Event listeners
facade.addEventListener("click", e => {
  newTimer();
});

clockFace.addEventListener("click", e => {
   
  let clickedClass = e.target.parentNode.className;
  let face;
  let plus;
  let id;
  let span;
  let minus;
  let input;
  let play;

  
  if(clickedClass === "buttonWrapper"){
    face = e.target.parentNode.parentNode;
    id = face.className.match(/\d+/g);
    plus = face.firstElementChild;
    span = face.firstElementChild.nextSibling;
    minus = span.nextSibling;
    input = minus.nextSibling;
    play = e.target.parentNode.firstElementChild;
  } else { //face div
    face = e.target.parentNode;
    id = face.className.match(/\d+/g);
    plus = face.firstElementChild;
    span = plus.nextSibling;  
  }
  
  if (e.target.tagName === "BUTTON") {
   
    const button = e.target;

    if (button.textContent === "+") { 
      
      span.textContent = counterArray[id].add1();
    
    } else if (button.textContent === "-") {

      span.textContent = counterArray[id].sub1();

    } else if (button.textContent === "▶") {
      
      const checkInput = document.querySelector('input');

      if(checkInput !== null){
        const nameTag = document.createElement("span");
        nameTag.className = "timerLabel";
        nameTag.textContent = input.value;
        face.insertBefore(nameTag, input);
        face.removeChild(input);
      }

       button.innerHTML = "‖"; 
       plus.style.display = "none";
       minus.style.display = "none";

      if (counterArray[id].getCount() === 0) {

         console.log("error --> can't count down form zero!");

      } else if(clockArray[id].getPaused()) {
        
       clockArray[id].resume(span, id);

      } else{

        clockArray[id].movement(span, counterArray[id].getCount(),0, id);

      }
      
    } else if (button.textContent === "‖") {
  
      pausedTime = span.innerHTML.split(':');
      clockArray[id].pause( parseInt(pausedTime[0]), parseInt(pausedTime[1]), true);
      clockArray[id].reset();
      button.innerHTML = "▶";
    
    } else if (button.textContent === "↺") {

      clockArray[id].reset();
      clockArray[id].setPaused(false);
      counterArray[id].reset();
      span.className = "hands";
      span.textContent = "00:00";
      plus.style.display = "";
      minus.style.display = "";
      play.innerHTML = "▶";
  
    } else if (button.textContent === "X") {
      clockFace.removeChild(face);
    }
  }
  
});

// regular functions
function newTimer() {
  
  const face = document.createElement("div");
  const id = addIndexId();
  face.className = "face " + id;

  const span = document.createElement("span");
  span.innerHTML = "00:00";
  span.className= 'hands';
  
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className="buttonWrapper";
  
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "name your timer";
  input.className = "timerTitle";
        
  const buttonPlus = document.createElement("button");
  buttonPlus.className = "timeSetter";
  buttonPlus.textContent = "+";

  const buttonMinus = document.createElement("button");
  buttonMinus.className = "timeSetter";
  buttonMinus.textContent = "-";

  const buttonStart = document.createElement("button");
  buttonStart.textContent = "▶";


  const buttonReset = document.createElement("button");
  buttonReset.textContent = "↺";


  const buttonDelete = document.createElement("button");
  buttonDelete.textContent = "X";


  face.appendChild(buttonPlus);
  face.appendChild(span);
  face.appendChild(buttonMinus);
  face.appendChild(input);
  buttonWrapper.appendChild(buttonStart);
  buttonWrapper.appendChild(buttonReset);
  buttonWrapper.appendChild(buttonDelete);
  face.appendChild(buttonWrapper);
  clockFace.appendChild(face);

  counterArray.push(new Counter(0, 1));
  clockArray.push(new Clock());
}

function endTime(date, minutes, seconds = 0) {
  return new Date(date.getTime() + minutes * 60000 + seconds * 1000);
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor(t / 1000 % 60);
  var minutes = Math.floor(t / 1000 / 60 % 60);
  var hours = Math.floor(t / (1000 * 60 * 60) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

var addIndexId = (function() {
  var counter = -1;
  return function() {
    return (counter += 1);
  };
})();

// objects
function Clock() {
  
  this.clear = false;
  this.pausedMins;
  this.pausedSecs;
  this.isPaused = false;
  
  this.movement = function(h1, mins, secs = 0, id) {
    var now = new Date();

    this.setTimer = endTime(now, mins, secs);

    this.runTimer = setInterval(e => {
      var t = getTimeRemaining(this.setTimer);
      var seconds = t.seconds;
      var mins = t.minutes;
      var hrs = t.hours;

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if(hrs <= 0){
        hrs = ' ';
      }else{
        hrs = hrs + " : ";
        mins = "0" + mins;
      }

      h1.textContent = hrs + mins + " : " + seconds;
      
      if (t.total <= 0) {
        clearInterval(this.runTimer);
        h1.className = "hands green";
        chime.play();
        this.clear = true;
      }
    }, 1000);
  };

  this.reset = function() {
     clearInterval(this.runTimer);
  };
  
  this.pause = function(mins, sec, state){
    this.pausedMins = mins;
    this.pausedSecs = sec;
    this.isPaused = state;
  }
  
  this.getPaused = function(){
      return this.isPaused;
   }
  
  this.setPaused = function(paused){
    this.isPaused = paused;
  }
  
  this.resume = function(h1,id){
    this.movement(h1,this.pausedMins, this.pausedSecs,id);
  }  
}


function Counter(startNum, incBy) {
  this.count = startNum;
  this.inc = incBy;

  this.add1 = function() {
    this.count += this.inc;
    return this.count + ":00";
  };

  this.sub1 = function() {
    this.count -= this.inc;
    if (this.count < 0) {
      this.count = 0;
    }
    return this.count + ":00";
  };

  this.getCount = function() {
    return this.count;
  };

  this.reset = function() {
    this.count = 0;
  };
}