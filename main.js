
var main = new main();
   main.loadResoures();

/////////////////////////////Background
function Background(){
	this.isCollidable = false;
	
	this.update = function(){
		//this.context.clearRect(this.x , this.y , this.width, this.height );	
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

   }     
        
	this.update = function(){
		
		//this.context.clearRect(this.pos.x , this.pos.y , this.width, this.height );	

		this.pos.x += this._vx;
        this.pos.y += this._vy;	       
		
		if( this.isColliding && this.isCollideWith("bullet") ){

				if(this.scale == 1){
				
				var obj = Game_Objs.get_From_Pool("rocks", this.pos.x, this.pos.y, 0 );
				
				this.scale *= .5;
				if(obj != null)
				    obj.scale = .5;   
				}
				else{
				    Game_Objs.remove_From_Pool("rocks", this);
				    this.alive = false;
				  }
		};
		
		if( !( GameWindow.get().rect.Contains(this.pos.x, this.pos.y)) &&
		!(GameWindow.get().rect.Contains(this.pos.x + this.width, this.pos.y + this.height )) ){	    
		     this.pos.x = this.startX;
             this.pos.y = this.startY;
          }
          
	};
};
Rock.prototype = new Drawable();
Rock.prototype.constructor = Rock;

/////////////////////////////Bullet
function Bullet(){
	this.speed = 10;
	this.alive = false;
	
	this.update = function(){

		this.context.clearRect(this.pos.x-10 , this.pos.y-10 , this.width+10, this.height+10 );	
		
		MoveDirection(this.pos, this.angle, this.speed);
			
	    if( this.isColliding && this.isCollideWith("rock") ){
			Game_Objs.remove_From_Pool("bullets", this);
			this.alive = false;
		}
			
		if( !( GameWindow.get().rect.Contains(this.pos.x, this.pos.y)) ){	
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
	//this.origin.set(Resourses.get().getImg('ship').width/ -2, Resourses.get().getImg('ship').height/ -2);
	//this.scale = .5;
  
	this.update = function(){
		counter++;		

        if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up || KEY_STATUS.space || KEY_STATUS.mouseIsDown) {
										
			this.context.clearRect(this.pos.x -10, this.pos.y -4, this.width+20, this.height +8);	
		
		    if(KEY_STATUS.mouseIsDown){
			     MoveTowards(this.pos, mousePosition, 2);
			    }
		
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
			    var bulletPos = new Vector2(this.pos.x, this.pos.y); // x - 6
			    MoveDirection(bulletPos, this.angle, 5);

			    Game_Objs.get_From_Pool("bullets", bulletPos.x, bulletPos.y, this.angle);

		      ////////////////  Resourses.get().getSndPool('laser');
			    
			    counter = 0;
		    }
		
		    if(this.angle >= Math.PI*2 || this.angle <= Math.PI*-2)
	            this.angle = 0; 	      
			 
	    }
	    else if(this.speed > 0 )
			 this.speed -= .05;
			 
		MoveDirection(this.pos, this.angle, this.speed );//+ Game_Window.elapsed/100

	};
	// Overiding the draw function
	this.draw = function() {
				
		  if( this.isColliding && this.isCollideWith("rock") )
		     this.drawRect();

        this.transform();

		this.context.drawImage(this.image, this.origin.x , this.origin.y );

		this.context.restore(); 
	}	
};
Player.prototype = new Drawable();
//Player.prototype.constructor = Player;

///////////////////////////////////////////////////////// Main
function main()
{
	this.loadResoures = function(){
		Resourses.get().addImg('ship',  "imgs/ship.png");
        Resourses.get().addImg('bg', "imgs/bg.png");
        Resourses.get().addImg('bullet', "imgs/bullet.png");
        Resourses.get().addImg('rock', "imgs/rock.png");
        Resourses.get().addImg('notused', "imgs/game.jpg");
        
       // Resourses.get().addSnd('bgMusic', "sounds/kick_shock.wav", true);
       // Resourses.get().addSnd('gameOver', "sounds/game_over.wav", true);

       // Resourses.get().addSndPool('laser', "sounds/laser.wav", 10);
        
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
			this.player.init("player", 300, 175, Resourses.get().getImg('ship'));
			this.player.origin.set(this.player.width/ -2, this.player.height/ -2);
			//this.player.scale = .5;
			Game_Objs.add(this.player);	
			
			var rock = new Rock();	
			rock.init("rock", -50, -50, Resourses.get().getImg('rock'));		
			Game_Objs.addPool(rock, "rocks", 6);
						
			
			var bullet = new Bullet();
			bullet.init("bullet", 0, 0, Resourses.get().getImg('bullet'));
			Game_Objs.addPool(bullet, "bullets", 30);
			
			document.getElementById('loading').style.display = "none";
						
		//////////////////////////////////////////////	Resourses.get().getSnd('bgMusic').play();
				    
			animate();
		//	return true;
		}  // else 
			//return false;
	}

};

////////////////////////////////////////////// Game loop
function animate() {
	
	GameWindow.get().Update( true, animate );
	
	document.getElementById('fps').innerHTML = GameWindow.get().avgFramerate + ' bullets active ' +
	Game_Objs.get_Pool_Active_Count("bullets") ;
	
	//ChangeMusic();
    
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
       	
      obj = Game_Objs.get_From_Pool("rocks", -50, -50, 0 );
      
        if(obj){
           obj.scale = 1;
          }
            
       Rockcounter = 0;
    }		    
};


