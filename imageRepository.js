
var Resourses = (function(){
	
function resourses() {
	this.imageNames = new Array();
	this.images = new Array();
	this.soundNames = new Array();
	this.sounds = new Array();
	this.soundpoolNames = new Array();
	this.soundpools = new Array();
	
	this.sndFXvolume = .1;// Make Global volume control
	this.musicVolume = .1;
	
	this.addImg = function(name, fileName){
		this.imageNames.push(name);
		var img = new Image();
		
		img.src = fileName;
		
		this.images.push(img);
	}
	
	this.getImg = function(name){
		
		for(var i = 0; i < this.imageNames.length; i++){
		     if(this.imageNames[i] == name)
		        return this.images[i];
		}
		console.error(name +" not found");
	}
/////////////// Sounds	
	this.addSnd = function(name, fileName, isMusic){
		this.soundNames.push(name);
		
		var snd = new Audio(fileName);
		   if(isMusic){
              snd.loop = true;
              snd.volume = this.musicVolume;
           }
           else
              snd.volume = this.sndFXvolume;
              
            snd.load();
		
		this.sounds.push(snd);
	}
	
	this.getSnd = function(name){
		
		for(var i = 0; i < this.soundNames.length; i++){
		     if(this.soundNames[i] == name)
		        return this.sounds[i];
		}
		console.error(name +" not found");
	}
	
	this.addSndPool = function(name, fileName, MaxSize){
		
		this.soundpoolNames.push(name);
		
		var newPool = new SoundPool( fileName, .25, MaxSize);
			
		this.soundpools.push(newPool);
	}
	
	this.getSndPool = function(name){
		
		for(var i = 0; i < this.soundpoolNames.length; i++){
		     if(this.soundpoolNames[i] == name){
		         this.soundpools[i].get();
		         return;
		     }
		}
		console.error(name +" not found");
	}
	
	this.onloadCallback = function(callback){
		this.checkResource = window.setInterval(function(){Resourses.get().isLoaded()},10);
			
		if (callback && typeof(callback) === "function") {
            this.callback = callback;
        }
        else console.error('callback invalid');
	}
	

	this.isLoaded = function(){		
		
		for(var i = 0; i < this.soundpools.length; i++){
		     if(!(this.soundpools[i].isLoaded()) ){
		         return;
		     }
		}
		
		for(var i = 0; i < this.images.length; i++){
		     if( !(this.images[i].complete) ){  	 
		        return;	        
		       }      
		}
		
		for(var i = 0; i < this.sounds.length; i++){
		     if( !(this.sounds[i].readyState === 4) ){   	
		        return;	        
		       }      
		}
		
		window.clearInterval(this.checkResource);
		console.log('ret true');
		this.callback();

	}
};// end resourses class


function SoundPool( fileName, volume, maxSize) {
        var size = maxSize;
        var pool = [];
        this.pool = pool;
        var currSound = 0;
        	
        	for (var i = 0; i < size; i++) {
                 snd = new Audio(fileName);
                 snd.volume = volume;
                 snd.load();
                 pool[i] = snd;
             }
             
        this.isLoaded = function(){
        	for (var i = 0; i < size; i++) {
        		if( !(pool[i].readyState === 4) ){   	
		        return false;	        
		       } 
        	}
        	return true;
        }     
        
        this.get = function() {
                if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
                        pool[currSound].play();
                }
                currSound = (currSound + 1) % size;
        };
}

  var instance;
    return {
        get: function(){
            if (instance == null) {
                instance = new resourses();
                // Hide the constructor
                instance.constructor = null;
            }          
            return instance;
        }
  };

})();
