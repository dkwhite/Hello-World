Array.prototype.Remove = function(arg, all)
{
        for (var i = 0; i < this.length; i++)
        {
                if (this[i] == arg)
                {
                        this.splice(i, 1);
                        
                        if (all == null || !all)
                                break;
                        else
                                i--;
                }
        }
}

Array.prototype.RemoveAt = function(position)
{
        this.splice(position, 1);
}

Array.prototype.Clear = function()
{
        this.length = 0;
}

Array.prototype.InsertAt = function(arg, position)
{
        var arr1 = this.slice(0, position);
        var arr2 = this.slice(position);
        
        this.Clear();
        
        for (var i = 0; i < arr1.length; i++)
                this.push(arr1[i]);
        
        this.push(arg);
        
        for (var j = 0; j < arr2.length; j++)
                this.push(arr2[j]);
}

Array.prototype.Contains = function(arg)
{
        for (var i = 0; i < this.length; i++)
                if (this[i] == arg)
                        return true;
                        
        return false;
}

Array.prototype.Occurs = function(arg)
{
        var counter = 0;
        
        for (var i = 0; i < this.length; i++)
        {
                if (this[i] == arg)
                        counter++;
        }
        
        return counter;
}

//////////////////Pools
function Pool(Poolname, maxSize) {
        var size = maxSize; // Max allowed in the pool
        var pool = [];
        this.Name = Poolname;
        this.ActiveCount;
        
        this.init = function(Obj) {
        	Obj.alive = false;
        	
        	pool.push(Obj);
        	
        	for (var i = 1; i < size; i++) {
        	//	var name = Obj.getName();
        		//console.error(name);
        		
                var newObj = new Obj.constructor;
                var canvasSize = new Vector2(Obj.canvasWidth, Obj.canvasHeight)
                newObj.init(Obj.name, Obj.rect.x, Obj.rect.y, Obj.image, Obj.context, canvasSize);
                newObj.alive = false;
                newObj.spawn();
                pool.push(newObj);
            }
            
            
        }
        
        this.getPool = function() {
        	     this.ActiveCount = 0;
                var objArray = [];

                for (var i = 0; i < size; i++) {
                        if (pool[i].alive) {
                                objArray.push(pool[i]);
                                 this.ActiveCount++;
                        }
                }
                return objArray;
        }
        
        this.remove = function(Obj) {

            pool.Remove(Obj);
            pool.push(Obj);
           
           // console.error(Obj.name +
        //	 	" called " 
        //	 	+ pool[0].alive
        //	 	+ pool[1].alive
        //	 	+ pool[2].alive
        //	 	+ pool[3].alive
        //	 	+ pool[4].alive);
        	
        }
        
        this.get = function(x, y, angle) {
        	 
                if(!pool[size - 1].alive) {
                        this.spawn(pool[size - 1], x, y, angle);
                       // console.error(" alive");
                        pool.unshift( pool.pop() );
                        return pool[0];
                }
                
             return null;   
        };
        
        this.spawn = function(Obj, x, y, angle) {
                Obj.pos.x = x;
                Obj.pos.y = y;
                Obj.angle = angle;
                Obj.spawn();
                Obj.alive = true;                
        };
       
}

//////////////////all entities
function Entities()
{
	this.ID = 0;
	this.entities = new Array();
	this.pools = new Array();
	this.Active = new Array();
	
	this.add =function(arg){ this.entities.push(arg);}// return this.ID++;}
	
	this.addPool =function(obj, Name, size){
		var newPool = new Pool(Name, size);
		newPool.init(obj);
		
		this.pools.push(newPool);
	}
	
	this.get_From_Pool = function(Name, x, y, angle) {
		
		for(var i=0; i<this.pools.length; i++){
			if(Name == this.pools[i].Name){
			     return this.pools[i].get(x, y, angle);		  
			    }
		}
		
		console.error("Pool name not found"); //gives you the red errormessage
	}
	
	this.remove_From_Pool = function(poolName, Obj) {
		
		for(var i=0; i<this.pools.length; i++){
			if(poolName == this.pools[i].Name){
			     this.pools[i].remove(Obj);
			     return;
			    }
		}
		
		console.error("Pool name not found"); //gives you the red errormessage
	}
	
	this.get_Pool_Active_Count = function(poolName) {
		
		for(var i=0; i<this.pools.length; i++){
			if(poolName == this.pools[i].Name){
			     return this.pools[i].ActiveCount;
			     
			    }
		}
		
		console.error("Pool name not found"); //gives you the red errormessage
	}
	
	
	this.remove =function(arg){ this.entities.Remove(arg, false);}
	
	this.UpdateAll =function()
	{
		this.Active.Clear();
		
		this.Active = this.Active.concat(this.entities);
		
		for(var i=0; i<this.pools.length; i++)
		    this.Active = this.Active.concat( this.pools[i].getPool() );
		
		
		 quadTree.clear();
      
    quadTree.insert(this.Active);
        
        detectCollision();
        
		for(var i=0; i<this.Active.length; i++)
	        this.Active[i].update();
	}
	
	this.DrawAll =function()
	{
		for(var i=0; i<this.Active.length; i++){
	        this.Active[i].draw();
	        this.Active[i].clear_Collision();
	       }
	}
		
}

var Game_Objs = new Entities();



function detectCollision() {
	
        var objects = [];
        quadTree.getAllObjects(objects);
        
        for (var x = 0, len = objects.length; x < len; x++) {                
                quadTree.findObjects(obj = [], objects[x]);
                
                for (y = 0, length = obj.length; y < length; y++) {

                        // DETECT COLLISION ALGORITHM
                        if ( !(objects[x] == obj[y]) &&
                        	objects[x].Intersect(obj[y]) )
                        {
                                objects[x].isColliding = true;
                                obj[y].isColliding = true;
                                objects[x].collide_list.push(obj[y]);
                                //obj[y].collide_list.push(objects[x]);
                        }
                }
        }
        
        
       // console.error("k " + main.quadTree.nodes[0].bounds.width);
  /*      
        for(var i = 0; i < main.quadTree.nodes.length; i++){
       // main.mainContext.fillStyle="#FF0000";
       main.mainContext.beginPath();
		main.mainContext.rect(main.quadTree.nodes[i].bounds.x, 
			main.quadTree.nodes[i].bounds.y, 
			main.quadTree.nodes[i].bounds.width, 
			main.quadTree.nodes[i].bounds.height);
			
			main.mainContext.stroke();
		}
    */    
};

