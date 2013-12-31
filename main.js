
var main = new main();
   main.loadResoures();

/////////////////////////////Background
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
	
   // Spawn function used by Game_Objs.get_From_Pool   
   this.spawn = function(){ 	
   	  
   	    this._vx = this.speed * Math.random() + this.speed;
        this._vy = this.speed * Math.random() + this.speed;                                
        
        //pick a random direction on x axis
        if(Math.random() > .5)
            this._vx *= -1;
        
        //pick a random direction on y axis
        if(Math.random() > .5)
            this._vy *= -1;

	    if(this._vy < 0)
	        this.startY = 360;
        else
	        this.startY = 0;
	        
        this.startX = Math.floor(Math.random()*400 + 50);
        
        this.UpdateRect(); 
   }     
        
	this.update = function(){
		
		this.context.clearRect(this.rect.x , this.rect.y , this.rect.width, this.rect.height );	
		
		this.pos.x += this._vx;
        this.pos.y += this._vy;	       
			
		if( this.isColliding && this.isCollideWith("bullet") ){

				if(this.scale == 1){
				
				var obj = Game_Objs.get_From_Pool("rocks", this.rect.x, this.rect.y, this.angle );
				
				this.scale *= .5;
				if(obj != null)
				    obj.scale = .5;   
				}
				else{
				    Game_Objs.remove_From_Pool("rocks", this);
				    this.alive = false;
				  }
		};
		
		if( !( GameWindow.get().rect.Contains(this.rect.x, this.rect.y)) &&
		!(GameWindow.get().rect.Contains(this.rect.x + this.rect.width, this.rect.y + this.rect.height )) ){	    
		     this.pos.x = this.startX;
             this.pos.y = this.startY;
          }
          
          this.UpdateRect(); 
	};
};
Rock.prototype = new Drawable();
Rock.prototype.constructor = Rock;

/////////////////////////////Bullet
function Bullet(){
	this.speed = 10;
	this.alive = false;
	
	this.update = function(){
		
		this.context.clearRect(this.rect.x-10 , this.rect.y-10 , this.rect.width+10, this.rect.height+10 );	
		
		MoveDirection(this.pos, this.angle, this.speed);

		this.UpdateRect(); 
			
	    if( this.isColliding && this.isCollideWith("rock") ){
			Game_Objs.remove_From_Pool("bullets", this);
			this.alive = false;
		}
			
		if( !( GameWindow.get().rect.Contains(this.rect.x, this.rect.y)) ){	
			Game_Objs.remove_From_Pool("bullets", this);
		    this.alive = false;
		}
	}
		    
};
Bullet.prototype = new Drawable();
Bullet.prototype.constructor = Bullet;

/////////////////////////////Player
function Player() {
	this.speed = 0; // Redefine speed
	var MaxSpeed = 3;
	var counter = 0;
  
	this.update = function(){
		counter++;

        if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up || KEY_STATUS.space || KEY_STATUS.mouseIsDown) {
										
			this.context.clearRect(this.rect.x -10, this.rect.y -4, this.rect.width+20, this.rect.height +8);	
		
		    if(KEY_STATUS.mouseIsDown)
			     MoveTowards(this.pos, mousePosition, 2);
		
		    if(KEY_STATUS.left)
		        this.angle -= .1;

		    if(KEY_STATUS.right)
		        this.angle += .1;  

		    if(KEY_STATUS.up){	
			if(this.speed < MaxSpeed)
				this.speed += .05;
            else 
			    this.speed = MaxSpeed;	
		    }
		
		    if(KEY_STATUS.space  && counter > 10){
			    var bulletPos = new Vector2(this.rect.x + this.originX -6, this.rect.y + this.originY);
			    MoveDirection(bulletPos, this.angle, 20);

			    Game_Objs.get_From_Pool("bullets", bulletPos.x, bulletPos.y, this.angle);

		        Resourses.get().getSndPool('laser');
			    
			    counter = 0;
		    }
		
		    if(this.angle >= Math.PI*2 || this.angle <= Math.PI*-2)
	            this.angle = 0; 	      
			 
	    }
	    else if(this.speed > 0 )
			 this.speed -= .05;
			 
		MoveDirection(this.pos, this.angle, this.speed );//+ Game_Window.elapsed/100
		 // Update changes to position	 
		this.UpdateRect(); 
	};
	// Overiding the draw function
	this.draw = function() {
				
		  if( this.isColliding && this.isCollideWith("rock") )
		     this.drawRect();
		    
		this.rotate(this.angle); 

        this.context.drawImage(this.image, 0, 0, this.rect.width, this.rect.height,
        	this.rect.x , this.rect.y, 
        	this.rect.width * this.scale, 
        	this.rect.height * this.scale);
        	
        this.unrotate(this.angle);      
	}	
};
Player.prototype = new Drawable();

function main()
{
	this.loadResoures = function(){
		Resourses.get().addImg('ship',  "imgs/ship.png");
        Resourses.get().addImg('bg', "imgs/bg.png");
        Resourses.get().addImg('bullet', "imgs/bullet.png");
        Resourses.get().addImg('rock', "imgs/rock.png");
        Resourses.get().addImg('notused', "imgs/game.jpg");
        
        Resourses.get().addSnd('bgMusic', "sounds/kick_shock.wav", true);
        Resourses.get().addSnd('gameOver', "sounds/game_over.wav", true);

        Resourses.get().addSndPool('laser', "sounds/laser.wav", 10);
        
        Resourses.get().onloadCallback( function(){main.init()} );
	};

	this.init = function()
	{		
	    GameWindow.get().init('main');	
		
		if (GameWindow.get().mainCanvas.getContext) {		

			// Initialize the objects	
			this.bg = new Background();
			this.bg.init("background", 0, 0, Resourses.get().getImg('bg') );
			Game_Objs.add(this.bg);
					
			this.player = new Player();
			this.player.init("player", 20, 150, Resourses.get().getImg('ship'));
			Game_Objs.add(this.player);
			
			var rock = new Rock();
			rock.init("rock", -50, -50, Resourses.get().getImg('rock'));
			Game_Objs.addPool(rock, "rocks", 6);
			
			var bullet = new Bullet();
			bullet.init("bullet", 0, 0, Resourses.get().getImg('bullet'));
			Game_Objs.addPool(bullet, "bullets", 30);
			
			document.getElementById('loading').style.display = "none";
			Resourses.get().getSnd('bgMusic').play();
			animate();
		//	return true;
		}  // else 
			//return false;
	}
	
	this.start = function(){
		Resourses.get().getSnd('bgMusic').play();
		animate();
	};
};

function animate() {
	
	GameWindow.get().Update( true, animate );
	
	document.getElementById('fps').innerHTML = GameWindow.get().avgFramerate;
	
	ChangeMusic();

	SpawnRocks(); 
    
    Game_Objs.UpdateAll();
           
    Game_Objs.DrawAll();   
};

/////////////////////////////Change Music
function ChangeMusic(){
	//this dosn't work very well because I need a key realease 
	if(KEY_STATUS.s){	
		if( Resourses.get().getSnd('bgMusic').paused ){
		    Resourses.get().getSnd('gameOver').pause();
            Resourses.get().getSnd('bgMusic').play();
		}
		else{       
            Resourses.get().getSnd('bgMusic').pause();
            Resourses.get().getSnd('gameOver').play();
            console.log("background pause")
		}
	}	    
};

/////////////////////////////Spawn Rocks
var Rockcounter = 0;
function SpawnRocks(){
	Rockcounter++;

    if(Rockcounter > 200 && Game_Objs.get_Pool_Active_Count("rocks") < 3){
       	
      obj = Game_Objs.get_From_Pool("rocks", -50, -50, 0);
      
        if(obj)
           obj.scale = 1;
            
       Rockcounter = 0;
    }		    
};


