//Rectangle
function Rectangle(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.Intersect = function(other){	
		return !(this.x > other.width + other.x || other.x > this.width + this.x || 
			this.y > other.height + other.y || other.y > this.height + this.y);
	}
	
	this.Contains = function(x, y){
		if(x >= this.x && x <= this.x + this.width &&
			y >= this.y && y <= this.y + this.height )
				return true;

			return false;
	 }
	 
};

