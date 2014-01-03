// Drawable
function Drawable() {	
	this.name="";
	this.alive = true;
	this.isCollidable = true;
	this.isColliding = false;
	this.collide_list = new Array();
	this.speed = 0;
	
	this.init = function(Name, x, y, image, ctx) {
			
		// Defualt variables
		this.name= Name;
		this.image = image;
		
        this.width = image.width;
        this.height = image.height;
        this.pos = new Vector2(x,y);	
	    this.angle = 0;
	    this.scale = 1;
	    this.origin = new Vector2(0, 0);
        
        console.log(this.name + ': ' + this.pos.x + ', ' + this.pos.y); 

        if(ctx != null)
            this.context = ctx;  
        else
            this.context = GameWindow.get().mainContext;      
	};
    
    this.clear_Collision = function(){
    	this.collide_list = [];
    	this.isColliding = false;
    };
   
    this.isCollideWith = function(Name){

    	for(var i = 0; i< this.collide_list.length; i++){
    		if(this.collide_list[i].name == Name)
    		    return true;
    	}
    	
    	return false;
    };
    
    this.Intersect = function(other){
    	
    	if(this.angle == 0 && other.angle == 0){
    		var originThisX = this.origin.x * this.scale;
    	    var originOtherX = other.origin.x * other.scale;
    	    var originThisY = this.origin.y * this.scale;
    	    var originOtherY = other.origin.y * other.scale;
    	
		return !(this.pos.x + originThisX > (other.width*other.scale) + other.pos.x + originOtherX || 
		    other.pos.x + originOtherX > (this.width*this.scale) + this.pos.x + originThisX || 
			this.pos.y + originThisY > (other.height*other.scale) + other.pos.y + originOtherY ||
			other.pos.y + originOtherY > this.height*this.scale + this.pos.y + originThisY );
			
		}
		else		
		    return RotRectsCollision(this, other);
	}

	// Define abstract function to be implemented in child objects
	this.spawn = function() {  };// this function used for init new new Pool objects
	
	this.update = function(){  this.isColliding = false;  console.log(this.name + ' drawable update')};
	
	this.draw = function() {
		
		if(this.isColliding)
		   this.drawRect();
		
        this.transform();
        
		this.context.drawImage(this.image, this.origin.x , this.origin.y );

		this.context.restore(); 
	};
	
	 this.transform = function(angle){
	    this.context.save();   

		this.context.translate(this.pos.x  , this.pos.y );
		this.context.rotate(this.angle);
        this.context.scale(this.scale, this.scale);
	 };

	// Draw bounding box for debugging purposes
	this.drawRect = function(){	
		this.transform();
        
		this.context.fillStyle="#FF0000";
		this.context.fillRect(this.origin.x , this.origin.y, this.width, this.height);
		
		this.context.restore(); 
	};
};

