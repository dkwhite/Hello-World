//Rectangle
//Drawable.prototype
function Rectangle(x, y, width, height){

	this.pos = new Vector2(x,y);
	this.width = width;
	this.height = height;
	
	this.angle = 0;
	this.scale = 1;
	this.origin = new Vector2(0, 0);
	
	this.Intersect = function(other){	
		return !(this.pos.x > other.width + other.pos.x || other.pos.x > this.width + this.pos.x || 
			this.pos.y > other.height + other.pos.y || other.pos.y > this.height + this.pos.y);
	}
	
	this.Contains = function(x, y){
		if(x >= this.pos.x && x <= this.pos.x + this.width &&
			y >= this.pos.y && y <= this.pos.y + this.height )
				return true;

			return false;
	 }
	 
};


var tmp = {
        A: new Vector2( 0, 0),
        B: new Vector2( 0, 0),// vertices of the rotated rr2
        C: new Vector2( 0, 0),// center of rr2
	    BL: new Vector2( 0, 0),
	    TR: new Vector2( 0, 0) // vertices of rr2 (bottom-left, top-right)
};

// Rotated Rectangles Collision Detection, Oren Becker, 2001
// must be rotated from center to work. maybe work on this later
function RotRectsCollision(rr1, rr2)
{

 var ang = rr1.angle - rr2.angle; // orientation of rotated rr1
     var cosa = Math.cos(ang);           // precalculated trigonometic -
     var sina = Math.sin(ang);           // - values for repeated use

 var t; var x; var a;      // temporary variables for various uses
 var dx;           // deltaX for linear equations
 var ext1; var ext2;   // min/max vertical values

var rr2originX = rr2.origin.x*rr2.scale;
var rr2originY = rr2.origin.y*rr2.scale;

tmp.C.set(rr2.pos.x + rr2originX + rr2.width*rr2.scale/2, rr2.pos.y + rr2originY + rr2.height*rr2.scale/2);

var rr1originX = rr1.origin.x*rr1.scale;
var rr1originY = rr1.origin.y*rr1.scale;

 // move rr2 to make rr1 cannonic
 tmp.C.x -= rr1.pos.x + rr1originX + rr1.width*rr1.scale/2;
 tmp.C.y -= rr1.pos.y + rr1originY + rr1.height*rr1.scale/2;
	
 // rotate rr2 clockwise by rr2->ang to make rr2 axis-aligned
tmp.C.RotateVector2DClockwise( rr2.angle);

tmp.BL.set(tmp.C.x, tmp.C.y);
tmp.TR.set(tmp.C.x, tmp.C.y);

var rr2CenterX = rr2.width/2 * rr2.scale;
var rr2CenterY = rr2.height/2 * rr2.scale;
 // calculate vertices of (moved and axis-aligned := 'ma') rr2
 tmp.BL.subtract( rr2CenterX , rr2CenterY );
 tmp.TR.add( rr2CenterX , rr2CenterY );

var rr1CenterX = rr1.width/2 * rr1.scale;
var rr1CenterY = rr1.height/2 * rr1.scale;
 // calculate vertices of (rotated := 'r') rr1
 tmp.A.x = -rr1CenterY*sina; tmp.B.x = tmp.A.x; t = rr1CenterX*cosa; tmp.A.x += t; tmp.B.x -= t;
 tmp.A.y = rr1CenterY*cosa; tmp.B.y = tmp.A.y; t = rr1CenterX*sina; tmp.A.y += t; tmp.B.y -= t;

 t = sina*cosa;

 // verify that A is vertical min/max, B is horizontal min/max
 if (t < 0){
  t = tmp.A.x; tmp.A.x = tmp.B.x; tmp.B.x = t;
  t = tmp.A.y; tmp.A.y = tmp.B.y; tmp.B.y = t;
 }

 // verify that B is horizontal minimum (leftest-vertex)
 if (sina < 0) { tmp.B.x = -tmp.B.x; tmp.B.y = -tmp.B.y; }

 // if rr2(ma) isn't in the horizontal range of
 // colliding with rr1(r), collision is impossible
 if (tmp.B.x > tmp.TR.x || tmp.B.x > (-tmp.BL.x) ) { return 0; }

 // if rr1(r) is axis-aligned, vertical min/max are easy to get
 if (t == 0) {ext1 = tmp.A.y; ext2 = -ext1; }
 // else, find vertical min/max in the range [BL.x, TR.x]
 else
 {
  x = tmp.BL.x-tmp.A.x; a = tmp.TR.x-tmp.A.x;
  ext1 = tmp.A.y;
  // if the first vertical min/max isn't in (BL.x, TR.x), then
  // find the vertical min/max on BL.x or on TR.x
  if (a*x > 0){
   dx = tmp.A.x;
   if (x < 0) { dx -= tmp.B.x; ext1 -= tmp.B.y; x = a; }
   else       { dx += tmp.B.x; ext1 += tmp.B.y; }
   ext1 *= x; ext1 /= dx; ext1 += tmp.A.y;
  }
  
  x = tmp.BL.x+tmp.A.x; a = tmp.TR.x+tmp.A.x;
  ext2 = -tmp.A.y;
  // if the second vertical min/max isn't in (BL.x, TR.x), then
  // find the local vertical min/max on BL.x or on TR.x
  if (a*x > 0)
  {
   dx = -tmp.A.x;
   if (x < 0) { dx -= tmp.B.x; ext2 -= tmp.B.y; x = a; }
   else       { dx += tmp.B.x; ext2 += tmp.B.y; }
   ext2 *= x; ext2 /= dx; ext2 -= tmp.A.y;
  }
 }

 // check whether rr2(ma) is in the vertical range of colliding with rr1(r)
 // (for the horizontal range of rr2)
 return !((ext1 < tmp.BL.y && ext2 < tmp.BL.y) ||
	  (ext1 > tmp.TR.y && ext2 > tmp.TR.y));
}

