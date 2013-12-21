
function GameWindow(){

	
this.avgFramerate = 0;
var frameCount = 0;
var elapsedCounter = 0;
var lastFrame = Date.now();
var thisFrame;
this.elapsed;

this.mainCanvas = document.getElementById('main');
this.mainContext = this.mainCanvas.getContext('2d');



this.Update = function( updateFrameRate ){
	
	thisFrame = Date.now();
	this.elapsed = thisFrame - lastFrame;
	lastFrame = thisFrame;
	
     if(updateFrameRate){
		frameCount++;
	    elapsedCounter += this.elapsed;
	
	    if (elapsedCounter > 1000) {
		    elapsedCounter -= 1000;
		    this.avgFramerate = frameCount;
		    frameCount = 0;
	    }
     }
     
}

};


var Game_Window = new GameWindow();
