/////////////////////////////////////////////vector2
Vector2 = function(x, y)
{
    this.x = x;
    this.y = y;

this.set = function(x, y){
    this.x = x;
    this.y = y;
};
/*
this.Move = function(vec2){
    this.x += vec2.x;
    this.y += vec2.y;
};
*/
this.setV = function( vec){
    this.x = vec.x;
    this.y = vec.y;
};

this.subtract = function( vec){
    this.x -= vec.x;
    this.y -= vec.y;
};

this.add = function(vec2){
    this.x += vec2.x;
    this.y += vec2.y;
};

this.Normalize = function(){
    var tmp = new Vector2(this.x, this.y);

    var mag = Math.sqrt((tmp.x * tmp.x) + (tmp.y * tmp.y));
    tmp.x = tmp.x / mag;
    tmp.y = tmp.y / mag;

  return tmp;
};

this.Distance = function(vec2){
    return Math.sqrt(((vec2.x - this.x) * (vec2.x - this.x)) + ((this.y - vec2.y) * (this.y - vec2.y)));
};

this.RotateVector2DClockwise = function( ang)
{
 var tmp = this.x;
 var cosa = Math.cos(ang);
 var sina = Math.sin(ang);

 this.x = tmp*cosa + this.y*sina;
 this.y = -tmp*sina + this.y*cosa;
}

};

//////////////////////////////////////////////////////Physics
function MoveTowards(startVec, endVec, speed){
	var tmp = new Vector2(endVec.x - startVec.x, endVec.y - startVec.y);
	tmp = tmp.Normalize();
	startVec.x += tmp.x * speed;
	startVec.y += tmp.y * speed;
	
	return startVec;
};

function GetAngle(vec1, vec2){
	var tmp = new Vector2(vec2.x - vec1.x, vec2.y - vec1.y);
	tmp = tmp.Normalize();

	var AngleDeg = Math.atan2(tmp.y, tmp.x) * (180/3.14159265);
	if(AngleDeg < 0)
	    AngleDeg *= -1;
	else
	AngleDeg = 180 - AngleDeg + 180;    

	return AngleDeg;
};

function MoveDirection(pos, angle, speed){
	pos.x += speed * Math.cos( angle );
    pos.y += speed * Math.sin( angle );
    
    return pos;
};