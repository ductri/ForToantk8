var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
var helper; helper=createHelper();
var gameEnv;
gameEnv=new GameEnv(canvas);
var myBall;
myBall = makeBall();
myBall.drawBall();

var map; map=createMap();
var userInput=new UserInput();

//Test area#######################################
//################################################


function keyDownHandler(e) {
	//Left
	if (e.keyCode==39) {
		userInput.right=true;
	}
	//Right
	else if (e.keyCode==37)
		userInput.left=true;

	if (e.keyCode==38)
		userInput.up=true;
}

function keyUpHandler(e) {
	//Left
	if (e.keyCode==39)
		userInput.right=false;
	//Right
	else if (e.keyCode==37)
		userInput.left=false;

	if (e.keyCode==38)
		userInput.up=false;
}

function makeBall() {
	var height=50;
	var width=50;
	var x=350;
	var xconst=240, yStatic=gameEnv.bound.h - height;
	var y=gameEnv.bound.h - height;
	var dx=2.5,dy=1;
	var maxHeight=100;

	var moveLeft=false;
	var moveRight=false;
	var moveDown=false;
	var moveUp=false;
	
	var tick=0;
	var speedJump=0.15;
	var jumpVelocity=10;
	var intervalJumpID=0;
	var intervalDownID=1;
	var jumping=false;
	var status=new Status();
	var g=100;
	var unknowRate=0.015;

	var vJump=-200;
	var v0=-vJump;
	//Luc di len thi chi di len 1 doan nhat dinh
	function jumpUp() {
		tick+=unknowRate;

		if (!status.canMoveUp) {
			v0=150;
			yStatic=y;
			tick=unknowRate;
		}

		y=yStatic+v0*tick+0.5*g*tick*tick;
		
		checkColision();
		
		if (!status.canMoveDown) {
			tick=0;
			moveUp=false;
			
			clearInterval(intervalJumpID);
			status.jumping=false;
		}
	};

	function getRectBound() {
		return new helper.createRect(x,y,width,height);
	};

	function checkColision() {
		status.canMoveLeft=true;
		status.canMoveRight=true;
		status.canMoveUp=true;
		status.canMoveDown=true;
		

		if (y + height >= gameEnv.bound.h) {
			status.canMoveDown=false;
			y=gameEnv.bound.h-height;
		}

		for (index = 0; index < map.length(); index++) {
			if (x - map.getWall(index).x > gameEnv.bound.w/2+100)
				continue;
			if (x - map.getWall(index).x < -(gameEnv.bound.w/2+240))
				continue;
			map.drawMap(index, -x + map.getWall(index).x + 240);

			if (helper.checkColision2Rect(getRectBound(),map.getWallBound(index))) {
				console.log("Has collision");
				var wall=map.getWallBound(index);
				var ballBounder=getRectBound();
				
				if (x<wall.x) {
					if (helper.checkPointBelongRect(wall.x,wall.y,ballBounder)) {
						if (y+height-wall.y < x+width-wall.x) {
							y=wall.y-height;
						} else {
							x=wall.x-width;
						}
					} else if (helper.checkPointBelongRect(wall.x, wall.y+wall.h,ballBounder)) {
						if ((wall.y+wall.h)-y < x+width-wall.x) {
							y=wall.y+wall.h;
						} else {
							x=wall.x-width;
						}
					} else {
						x=wall.x-width;
					}
				}
				else if (x+width>wall.x+wall.w) {
					if (helper.checkPointBelongRect(wall.x+wall.w,wall.y,ballBounder)) {
						
						if (y+height-wall.y < wall.x+wall.w-x) {
							y=wall.y-height;
							
						} else {
							x=wall.x+wall.w;
							
						}
					} else if (helper.checkPointBelongRect(wall.x+wall.w, wall.y+wall.h,ballBounder)) {
						if ((wall.y+wall.h)-y < wall.x+wall.w-x) {
							y=wall.y+wall.h;
						} else {
							x=wall.x+wall.w;
						}
					} else {
						x=wall.x+wall.w;
					}
				}
				else {
					if (y<wall.y)
						y=wall.y-height;
					else if (y+height>wall.y+wall.h)
						y=wall.y+wall.h;
				}

				if (x+width == wall.x)
					status.canMoveRight=false;
				if (x == wall.x+wall.w)
					status.canMoveLeft=false;
				if (y+height == wall.y)
					status.canMoveDown=false;
				if (y==wall.y+wall.h)
					status.canMoveUp=false;

				//Xet truong hop rieng 2 goc cham nhau
				if (x == wall.x + wall.w && y+height == wall.y)
					status.canMoveDown=true;
				if (x+width == wall.x && y+height == wall.y)
					status.canMoveDown=true;
			}
		}
	};
	
	return {
		/*seter, getter*/
		setLeft: function(value) {
			moveLeft=value;
		},
		setRight: function(value) {
			moveRight=value;
		},
		setUp: function(value) {
			moveUp=value;
		},

		drawBall:function()	{
			ctx.beginPath();
			ctx.rect(xconst, y, width, height);
			/*ctx.fillStyle = "#FF0000";
			ctx.fill();*/
			ctx.strokeStyle = "rgba(255, 0, 0, 1)";
			ctx.stroke();
			ctx.closePath();
		},
		getJumping: function(){
			return jumping;
		},
		getMoveLeft: function() {
			return moveLeft;
		},
		getMoveRight: function() {
			return moveRight;
		},
		getMoveUp: function() {
			return moveUp;
		}, 
		
		move: function(e) {
			ctx.clearRect(0,0,gameEnv.bound.w,gameEnv.bound.h);
			
			checkColision();
			
			if (userInput.right && status.canMoveRight)
				x+=dx;
			else if (userInput.left && status.canMoveLeft)
				x-=dx;

			if (!status.jumping)
				yStatic=y;
			if (userInput.up && status.canMoveUp && !status.jumping)
			{
				v0=vJump;
				intervalJumpID=setInterval(jumpUp,jumpVelocity);
				status.jumping=true;
			}
			if (status.canMoveDown && !status.jumping) {
				v0=100;
				intervalJumpID=setInterval(jumpUp,jumpVelocity);
				status.jumping=true;
			}

			this.drawBall();
		}
	}
}

function createMap() {
	var map=[];
	function createMapRandom(length) {
		var wall_instance;
		var x=0, y=0, h=0, w=0;
		function Wall(x, y, w, h) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}

		for (i=0; i<length; i++){
			x += helper.genRandomNumber(50, 500);
			w = helper.genRandomNumber(5,30);
			h = helper.genRandomNumber(10,100);
			y = gameEnv.bound.h - h;
			wall_instance = new Wall(x, y, w, h);
			map.push(wall_instance);
		}
		x=0;
		for (i=0;i<length;i++) {
			x += helper.genRandomNumber(50,400);
			y = helper.genRandomNumber(70,150);
			w = helper.genRandomNumber(30,100);
			h = helper.genRandomNumber(10,40);
			wall_instance = new Wall(x, y, w, h);
			map.push(wall_instance);
		}
	}

	/* CONSTRUCTOR*/
	createMapRandom(10);
	
	/* END OF CONSTRUCTOR*/
	return {
		length: function() {
			return map.length;
		},

		getWall: function(index) {
			return map[index];
		},

		getWallBound:function(index) {
			var t= new helper.createRect(map[index].x, map[index].y, map[index].w, map[index].h);
			return t;
		},

		//Ve 1 wall dua tren vi tri cua chinh no va vi tri cua nguoi choi
		drawMap:function(index, location) {
			ctx.beginPath();
			ctx.rect(location, map[index].y, map[index].w, map[index].h);

			ctx.strokeStyle = "rgba(0, 0, 255, 1)";
			ctx.stroke();

			ctx.closePath();
		}
	}
}

function createHelper() {
	return {
		genRandomNumber: function(min, max) {
			return Math.floor(Math.random()*(max-min)) + min;
		},
		createRect: function(xx,yy,w,h) {
			this.x = xx;
			this.y = yy;
			this.w = w;
			this.h = h;
		},

		checkPointBelongRect: function(x, y, rect) {
			if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h)
				return true;
			else return false;
		},

		checkColision2Rect: function(rect1, rect2) {
			if (!this.checkPointBelongRect(rect2.x, rect2.y, rect1) &&
				!this.checkPointBelongRect(rect2.x+rect2.w, rect2.y, rect1) &&
				!this.checkPointBelongRect(rect2.x+rect2.w, rect2.y+rect2.h, rect1) &&
				!this.checkPointBelongRect(rect2.x, rect2.y+rect2.h, rect1) && 
				!this.checkPointBelongRect(rect1.x, rect1.y, rect2) && 
				!this.checkPointBelongRect(rect1.x+rect1.w, rect1.y, rect2) &&
				!this.checkPointBelongRect(rect1.x+rect1.w, rect1.y+rect1.h, rect2) &&
				!this.checkPointBelongRect(rect2.x, rect2.y+rect2.h, rect1))
				return false;
			else return true;
		}
	}
}

function mainLoop() {
	myBall.move();
	
	window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);
