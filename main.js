

var main = new main();

function init()
{
	if(main.init())
		main.start();
};

/////////////////////////////Rock
function Background(){
	this.isCollidable = false;
	
	this.update = function(){
		//this.context.clearRect(this.rect.x , this.rect.y , this.rect.width, this.rect.height );	
	};
};
Background.prototype = new Drawable();


/////////////////////////////Rock
function Rock(){
	this.speed = 1;
	this.alive = false;
	
	
        
   this.spawn = function(){
   	 //this.speed += .5;
   	 this._vx = this.speed * Math.random() + this.speed;
        
        //y velocity and direction
        this._vy = this.speed * Math.random() + this.speed;                                
        
        //pick a random direction on x axis
        if(Math.random() > .5)
        {
                this._vx *= -1;
        }
        
        //pick a random direction on y axis
        if(Math.random() > .5)
        {
                this._vy *= -1;
        }
        
       // this.rect.x = Math.floor(Math.random()*300);
       // this.rect.y = Math.floor(Math.random()*300);
	if( this._vy < 0)
	    this.startY = 360;
	    
	if( this._vy > 0)
	    this.startY = 0;
	        
        this.startX = Math.floor(Math.random()*400 + 50);
   }     
        
	this.update = function(){
		
		//this.isColliding = false;
		
		this.context.clearRect(this.rect.x , this.rect.y , this.rect.width, this.rect.height );	
		
		
		
		if( this.isColliding && this.isCollideWith("bullet") ){
				//console.log("hit");
				//
				
				if(this.scale == 1){
				
				this.angle *= .5;
				var obj = Game_Objs.get_From_Pool("rocks", this.rect.x, this.rect.y, this.angle*-.5 );
				
				this.scale *= .5;
				if(obj != null)
				    obj.scale = .5;
				
				
				 //   if(this.scale == .5)
				   //     Game_Objs.remove_From_Pool("rocks", this);
				        
				  //  if(obj.scale == .5)
				    //    Game_Objs.remove_From_Pool("rocks", obj);    
				}
				else{
				    Game_Objs.remove_From_Pool("rocks", this);
				    this.alive = false;
				  }
		};
		
		this.rect.x += this._vx;
        this.rect.y += this._vy;
				
		var boundry = new Rectangle(0,0, this.canvasWidth, this.canvasHeight);
		
		if( !( boundry.Contains(this.rect.x, this.rect.y)) &&
		!(boundry.Contains(this.rect.x + this.rect.width, this.rect.y + this.rect.height )) ){	    
		     this.rect.x = this.startX;
             this.rect.y = this.startY;
          };
	};
};
Rock.prototype = new Drawable();
Rock.prototype.constructor = Rock;

/////////////////////////////Rock
function Bullet(){
	this.speed = 4;
	this.alive = false;
	
	this.update = function(){
		
		//this.isColliding = false;
		
		this.context.clearRect(this.rect.x-10 , this.rect.y-10 , this.rect.width+10, this.rect.height+10 );	
		
		var pos2 = new Vector2(this.rect.x, this.rect.y);
			
			var tmp = MoveDirection(pos2, this.angle, this.speed);
			this.rect.x = tmp.x;
			this.rect.y = tmp.y;
			
			//console.log("hit" + this.name);
			
			if( this.isColliding && this.isCollideWith("rock") ){
			//	console.log("hit");
			    Game_Objs.remove_From_Pool("bullets", this);
				this.alive = false;
			}
			   
		
		var boundry = new Rectangle(0,0, this.canvasWidth, this.canvasHeight);
				
		if( !( boundry.Contains(this.rect.x, this.rect.y)) ){	
			//console.error(this.rect.x + " k " + boundry.height);
			Game_Objs.remove_From_Pool("bullets", this);
		     this.alive = false;
		    }
		    //Game_Objs.remove(this);
		   }
		    
};
Bullet.prototype = new Drawable();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function Player() {
	this.speed = 0; // Redefine speed of the background for panning
	//this.scale = .5;
	var MaxSpeed = 2;
	var counter = 0;
 // this.scale.x = imageRepository.ship.width;
  //  this.scale.y = imageRepository.ship.height;
    
    
	this.update = function(){
		//this.isColliding = false;
		
		counter++;
  
//document.getElementById('fps').innerHTML =  Game_Objs.pools.length + ", " + Game_Objs.Active.length + ", " + Game_Objs.entities.length;	

        if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up || KEY_STATUS.space || KEY_STATUS.mouseIsDown) {
					
					
			this.context.clearRect(this.rect.x -10, this.rect.y -4, this.rect.width+20, this.rect.height +8);	
			
			var pos = new Vector2(this.rect.x + this.originX * this.scale, this.rect.y + this.originY * this.scale);
		
		
		if(KEY_STATUS.mouseIsDown){
			
			//var pos3 = new Vector2(mousePosition.x * this.scale, mousePosition.y * this.scale);
			//var pos2 = new Vector2(this.rect.x + this.rect.x * this.scale, this.rect.y + this.rect.y * this.scale);
			pos = MoveTowards(pos, mousePosition, 2);
			          
			this.rect.x += pos.x;
			this.rect.y += pos.y;
		}
		
		if(KEY_STATUS.left)
		    this.angle -= .1;

		if(KEY_STATUS.right)
		    this.angle += .1;  
		}  
		
		if(KEY_STATUS.up)
		{
			
			
			if(this.speed < MaxSpeed)
			{
				this.speed += .03;
			}
			if(this.speed > MaxSpeed)
			    this.speed = MaxSpeed;
			
			
		}
		else{
			if(this.speed > 0 )
			this.speed -= .05;
		}
		
		var pos2 = new Vector2(this.rect.x, this.rect.y);
		var tmp = MoveDirection(pos2, this.angle, this.speed );//+ Game_Window.elapsed/100
			this.rect.x = tmp.x;
			this.rect.y = tmp.y;
		
		if(KEY_STATUS.space  && counter > 15)
		{
			
			//var canvasSize = new Vector2(this.canvasWidth, this.canvasHeight);
			//var bullet = new Bullet();
			//bullet.init(this.rect.x + this.originX -6, this.rect.y + this.originY, imageRepository.bullet, this.context, canvasSize);
			//bullet.angle = this.angle;
			var bulletPos = new Vector2(this.rect.x + this.originX -6, this.rect.y + this.originY);
			 MoveDirection(bulletPos, this.angle, 20);
			//bullet.rect.x = bulletPos.x;
			//bullet.rect.y = bulletPos.y;
			//Game_Objs.add( bullet );
			////////console.error(bulletPos.x);
			
			Game_Objs.get_From_Pool("bullets", bulletPos.x, bulletPos.y, this.angle);
			counter = 0;
		}
		
		if(this.angle >= Math.PI*2 || this.angle <= Math.PI*-2)
	        this.angle = 0; 
	      
	      // ZOOM  
	    if(KEY_STATUS.z)
		    this.scale += .001;
		   
		if(KEY_STATUS.x)
			this.scale -= .001;    
	        
	       
	};
	
	this.draw = function() {
		
		  if( this.isColliding && this.isCollideWith("rock") )
		     this.drawRect();

		    
		this.rotate(this.angle); 

        this.context.drawImage(this.image, 0, 0, this.rect.width, this.rect.height,
        	this.rect.x , this.rect.y, 
        	this.rect.width * this.scale, 
        	this.rect.height * this.scale);
        	
        this.unrotate(this.angle);
        
	};
	
	
};
Player.prototype = new Drawable();

function main()
{
   this.tics = 0;

	
	this.init = function()
	{
		
		

		this.mainCanvas = document.getElementById('main');
		
		if (this.mainCanvas.getContext) {

			this.mainContext = this.mainCanvas.getContext('2d');

            var canvasSize = new Vector2(this.mainCanvas.width, this.mainCanvas.height);
            
			// Initialize the objects	
			this.bg = new Background();
			this.bg.init("background", 0, 0, imageRepository.background, this.mainContext, canvasSize);
			Game_Objs.add(this.bg);
		///	this.Ent.push(this.bg);
			
		//	this.bullet = new Bullet();
		//	this.bullet.init(500, 50, imageRepository.bullet, this.mainContext, canvasSize);
		//	this.Ent.push(this.bullet);
					
			this.player = new Player();
			this.player.init("player", 20, 150, imageRepository.ship, this.mainContext, canvasSize);
			Game_Objs.add(this.player);
		///	this.Ent.push(this.player);
			
			this.rock = new Rock();
			this.rock.init("rock", -50, -50, imageRepository.rock, this.mainContext, canvasSize);
			Game_Objs.addPool(this.rock, "rocks", 6);
            Game_Objs.get_From_Pool("rocks", -50, -50, 0);
            this.Rockcounter = 0;
			
			var bullet = new Bullet();
			bullet.init("bullet", 0, 0, imageRepository.bullet, this.mainContext, canvasSize);
			Game_Objs.addPool(bullet, "bullets", 30);
			
			
				
	console.log("in main"); //gives you the red errormessage		
		
			return true;
		} else {
			return false;
		}

	}
	
	this.start = function(){
		animate();
	};
};



function animate() {
	requestAnimFrame( animate );
	
	Game_Window.Update( true );
	
	document.getElementById('fps').innerHTML = Game_Window.avgFramerate + " fametic " + main.Rockcounter;

	 main.Rockcounter++;
	//main.bg.update();
//	for(i=0; i<main.Ent.length; i++){
	   // main.Ent[i].scale = main.bg.scale;
//	    main.Ent[i].update();
//	}
    if(main.Rockcounter > 200 && Game_Objs.get_Pool_Active_Count("rocks") < 3){
       	
      obj = Game_Objs.get_From_Pool("rocks", -50, -50, 0);
      
        if(obj)
           obj.scale = 1;
            
       main.Rockcounter = 0;
     //  console.log("spawn");
    }
    
    Game_Objs.UpdateAll();
    
       
        
    Game_Objs.DrawAll();

    
};


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