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
//################################################
//GAME INIT
//################################################
var bgImage=document.getElementById("bgImage");
//ctx.drawImage(bgImage,gameEnv.bound.w,gameEnv.bound.h);

var bx=0,by=bgImage.naturalHeight-gameEnv.bound.h;


//################################################
//END OF GAME INIT
//################################################
function drawBackground() {
    ctx.drawImage(bgImage,bx,by,gameEnv.bound.w, gameEnv.bound.h, gameEnv.bound.x, gameEnv.bound.y, gameEnv.bound.w, gameEnv.bound.h);
}


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
	var height=gameEnv.ballHeight;
	var width=gameEnv.ballWidth;
	var x=gameEnv.ballX;
	var xconst=gameEnv.bound.w/2, yStatic=gameEnv.bound.h - height;
	var y=gameEnv.bound.h - height;
	var dx=gameEnv.ballDx;

	var tick=0;
	var speedJump=0.15;
	var jumpVelocity=5;
	var intervalJumpID=0;
	var intervalDownID=1;
	var jumping=false;
	var status=new Status();
	var g=100;
	var unknowRate=0.015;

	var vJump=-200;
	var vDown=50;
	var vReflect=150;
	var v0=-vJump;
	//Luc di len thi chi di len 1 doan nhat dinh
	function jumpUp() {
		tick+=unknowRate;

		if (!status.canMoveUp) {
			v0=vReflect;
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
		

		if (y + height >= gameEnv.groundHeight) {
			status.canMoveDown=false;
			y=gameEnv.groundHeight-height;
		}

		for (index = 0; index < map.length(); index++) {
			if (x - map.getWall(index).x > gameEnv.bound.w/2+100)
				continue;
			if (x - map.getWall(index).x < -(gameEnv.bound.w/2+240))
				continue;
			map.drawMap(index, -x + map.getWall(index).x + gameEnv.bound.w/2);

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
	
    function moveLeft() {
        x+=dx;
        bx+=dx/2;
        
    }
    
    function moveRight() {
        x-=dx;
        bx-=dx/2;
    }
	return {
		/*seter, getter*/

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
		
		move: function(e) {
			
			
			checkColision();
			
			if (userInput.right && status.canMoveRight) {
				moveLeft();
			}
			else if (userInput.left && status.canMoveLeft) {
				moveRight();
			}

			if (!status.jumping)
				yStatic=y;
			if (userInput.up && status.canMoveUp && !status.jumping) {
				v0=vJump;
				intervalJumpID=setInterval(jumpUp,jumpVelocity);
				status.jumping=true;
			}
			if (status.canMoveDown && !status.jumping) {
				v0=vDown;
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
			x += helper.genRandomNumber(50, 500);
			w = helper.genRandomNumber(5,30);
			h = helper.genRandomNumber(10,100);
			y = gameEnv.groundHeight - h;
			wall_instance = new Wall(x, y, w, h);
			map.push(wall_instance);
		}
		x=0;
		for (i=0;i<length;i++) {
			x += helper.genRandomNumber(50,400);
			y = gameEnv.groundHeight-helper.genRandomNumber(100,350);
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

function mainLoop() {
    
    drawBackground();
	myBall.move();
	
	window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);
