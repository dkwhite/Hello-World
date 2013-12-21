function Background(image, viewRect, scale){
//	this.speed = 1;
    this.scale = scale;
    this.scaleTest = 1;
    this.size = new Vector2(viewRect.width,viewRect.height);
	this.viewRect = new Rectangle(viewRect.x, viewRect.y, viewRect.width,viewRect.height);
	this.center = new Vector2(this.viewRect.width / 2, this.viewRect.height / 2);
    this.viewRect.width = this.scale * image.width;
	this.viewRect.height = this.scale * image.height;
    
		this.update = function(){
			
		if(KEY_STATUS.z)
		    this.SetScale(.001);
		   
		if(KEY_STATUS.x)
			this.SetScale(-.001);
			
	    if(KEY_STATUS.t)
		    this.scaleTest += .001;
		   
		if(KEY_STATUS.y)
			this.scaleTest -= .001;		
		
		
		if(KEY_STATUS.a){
		    this.Move(-2,0);//this.viewRect.x -= 2;
		   }
		if(KEY_STATUS.d){
		    this.Move(2,0);//this.viewRect.x += 2;
		   }
		if(KEY_STATUS.w)
		    this.Move(0,-2);//this.viewRect.y -= 2;
		if(KEY_STATUS.s)
		    this.Move(0,2);//this.viewRect.y += 2;  
		       		   
	};
	
	this.SetScale = function(scale){
		this.scale += scale;
		
		if(this.scale > 1 )
		    this.scale = 1;	  
		    
		if(this.scale <= .25 )
		    this.scale = .25;	
		     
		this.viewRect.width = this.scale * this.rect.width;
		this.viewRect.height = this.scale * this.rect.height;
	};
	
	this.SetCenter = function(){
		this.center = new Vector2(this.viewRect.width / 2, this.viewRect.height / 2);
	};
	
	this.Move = function(x, y){
		this.viewRect.x += x;
		this.viewRect.y += y;
		
		this.CheckBounds(); 
	};
	
	this.CheckBounds = function(){
		if(this.viewRect.x < this.rect.x)
		       this.viewRect.x = this.rect.x;
		    if(this.viewRect.y < this.rect.y)
		       this.viewRect.y = this.rect.y; 
		    if(this.viewRect.x + this.viewRect.width > this.rect.width)
		       this.viewRect.x = this.rect.width - this.viewRect.width;
		    if(this.viewRect.y + this.viewRect.height > this.rect.height)
		       this.viewRect.y = this.rect.height - this.viewRect.height; 
	};
	
	this.draw = function(){
		
		
		var shitX = Gscale.x * imageRepository.game.width;
		var shitX2 = (imageRepository.game.width -  shitX) / 2;
		
		var shitY = Gscale.y * imageRepository.game.height;
		var shitY2 = (imageRepository.game.height -  shitY) / 2;
		
	 if( this.scaleTest != 1 ){
	    this.context.scale(this.scaleTest, this.scaleTest);
	    this.viewRect.width = this.scaleTest * this.rect.width;
		this.viewRect.height = this.scaleTest * this.rect.height;
		}
	    
		this.context.drawImage(imageRepository.game, 
			this.viewRect.x, this.viewRect.y,
			//shitX2 + this.bgrect.x, shitY2 +this.bgrect.y,
			this.viewRect.width,
			this.viewRect.height,
			 0, 0, this.size.x, this.size.y);
 
			// this.context.fillStyle="#FF0000";
		//this.context.fillRect(this.bgrect.x, this.bgrect.y, this.bgrect.width, this.bgrect.height);
		
		
		this.scaleTest = 1;
	};
};
Background.prototype = new Drawable();