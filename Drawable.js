// Drawable
function Drawable() {	
	this.name="";
	this.alive = true;
	this.isCollidable = true;
	this.isColliding = false;
	this.collide_list = new Array();
	//this.rect = new Rectangle(0, 0, 0, 0); 
	
	
	this.init = function(Name, x, y, image, ctx, canvasSize) {
		// Defualt variables
		this.name= Name;
		this.image = image;
		this.rect = new Rectangle(x, y, image.width, image.height);
		this.pos = new Vector2(x,y);
		//this.rect.x = x;
		//this.rect.y = y;
		//this.rect.width = image.width;
		//this.rect.height = image.height;
		
		
		//Origin is the center by defualt
		this.originX = this.rect.width/2;
        this.originY = this.rect.height/2; 
        
        this.angle = 0.0; 
        
        this.context;   
        
        if(ctx != null){
        this.context = ctx; 
        
        this.canvasWidth = canvasSize.x;
	    this.canvasHeight = canvasSize.y; 
        }
        else
        {
        this.context = GameWindow.get().mainContext;

        this.canvasWidth = GameWindow.get().mainCanvas.width;
	    this.canvasHeight = GameWindow.get().mainCanvas.height; 
	    }
	    //this.scale.Set(this.canvasWidth, this.canvasHeight); 
	    
	     
	}
	
	this.scale = 1;	
	this.speed = 0;
    
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
    	
    	if(this.angle == 0 && other.angle == 0)	
		return !(this.rect.x > (other.rect.width*other.scale) + other.rect.x || other.rect.x > (this.rect.width*this.scale) + this.rect.x || 
			this.rect.y > (other.rect.height*other.scale) + other.rect.y || other.rect.y > this.rect.height*this.scale + this.rect.y);
		else{
			this.rect.angle = this.angle;
			other.rect.angle = other.angle;
			
			this.rect.scale = this.scale;
			other.rect.scale = other.scale;
			
		    return RotRectsCollision(this.rect, other.rect);
		}
	}
	
	this.UpdateRect = function(){ this.rect.x = this.pos.x;	this.rect.y = this.pos.y;};

	// Define abstract function to be implemented in child objects
	this.spawn = function() { this.UpdateRect(); };// this function used for init new new Pool objects
	
	this.update = function(){  this.isColliding = false; };
	
	this.draw = function() {
		
		if(this.isColliding)
		   this.drawRect();
		   
		this.context.save();   
		this.rotate(this.angle);
		
		this.context.scale(this.scale, this.scale);
		this.context.translate(this.rect.x/this.scale, this.rect.y/this.scale);
		
		//this.context.drawImage(this.image, this.rect.x, this.rect.y);
		this.context.drawImage(this.image, 
			 0, 0,
			 this.image.width, this.image.height,
			 0, 0,
			 this.rect.width, this.rect.height);
		
		this.unrotate(this.angle);
		
		this.context.restore();
	};
	
	 this.rotate = function(angle){
	 	this.context.translate(this.rect.x + this.originX * this.scale, this.rect.y + this.originY * this.scale);
        this.context.rotate(angle);
        this.context.translate(-(this.rect.x + this.originX * this.scale), -(this.rect.y + this.originY * this.scale));
	 };
	 
	 this.unrotate = function(angle){
	 	this.rotate(-angle);
	 };
	// Draw bounding box for debugging purposes
	this.drawRect = function(){	
		this.rotate(this.angle);	
		this.context.fillStyle="#FF0000";
		this.context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		this.unrotate(this.angle);
	};
};