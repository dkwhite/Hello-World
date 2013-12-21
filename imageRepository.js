// Store Images here
var imageRepository = new function() {
/*	
	this.Names = new Array();
	this.add = function(name, location){
		for(i=0; i<Names.length; i++){
		     if(Name[i] == name)
		        return Names[i];
		}
		
		name = new Image();
		this.name.src = this.location;
	};
*/	
	// Define images
	this.empty = null;
	this.ship = new Image();
	this.background = new Image();
	this.bullet = new Image();
	this.rock = new Image();
	this.game = new Image();
	
	this.ship.src = "imgs/ship.png";
	this.background.src = "imgs/bg.png";
	this.bullet.src = "imgs/bullet.png";
	this.rock.src = "imgs/rock.png";
	this.game.src = "imgs/game.jpg";
};