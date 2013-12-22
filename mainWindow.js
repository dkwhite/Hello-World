
var GameWindow = (function(){

function GameWin(){
	
this.avgFramerate = 0;
var frameCount = 0;
var elapsedCounter = 0;
var lastFrame = Date.now();
var thisFrame;
this.elapsed;


this.init = function(canvasNane){

  this.mainCanvas = document.getElementById( canvasNane );
  this.mainContext = this.mainCanvas.getContext('2d');
  
  this.rect = new Rectangle(0, 0, this.mainCanvas.width, this.mainCanvas.height);
}


this.Update = function( updateFrameRate, func_callback ){
	
	requestAnimFrame( func_callback );
	
     if(updateFrameRate){
     	thisFrame = Date.now();
	    this.elapsed = thisFrame - lastFrame;
	    lastFrame = thisFrame;
     	
		frameCount++;
	    elapsedCounter += this.elapsed;
	
	    if (elapsedCounter > 1000) {
		    elapsedCounter -= 1000;
		    this.avgFramerate = frameCount;
		    frameCount = 0;
	    }
     }    
 };
  
 }//end class
  var instance;
    return {
    	//B: this.pri,
        get: function(){
            if (instance == null) {
                instance = new GameWin();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            
            return instance;
        }

  };

})();

window.requestAnimFrame = (function(){
	//return  window.requestAnimationFrame       || 
			//window.webkitRequestAnimationFrame || 
			//window.mozRequestAnimationFrame    || 
			//window.oRequestAnimationFrame      || 
			//window.msRequestAnimationFrame     || 
		return	function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 30);
			};
})();

//var Game_Window = new GameWindow();
