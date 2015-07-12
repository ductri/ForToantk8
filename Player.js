function createPlayer(gameEnvArg, mapArg, backgroundArg) {
    var gameEnv=gameEnvArg;
    var map=mapArg;
    var background=backgroundArg;
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
	
    var spritesIndex=0;
    var spriteX=14;
    var sprite=10;
    var spriteW=14;
    var spriteH=20;
    
    
    /*
    METHODS AREA
    */
    //Luc di len thi chi di len 1 doan nhat dinh
    //Private methods
	function jumpUp() {
		tick+=unknowRate;

		if (!status.canMoveUp) {
			v0=vReflect;
			yStatic=y;
			tick=unknowRate;
		}

		y=yStatic+v0*tick+0.5*g*tick*tick;
		
		setStatus();
		
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

	function setStatus() {
		status.canMoveLeft=true;
		status.canMoveRight=true;
		status.canMoveUp=true;
		status.canMoveDown=true;
		
		if (y + height >= map.getGroundHeight()) {
			status.canMoveDown=false;
			y=map.getGroundHeight()-height;
		}

		for (index = 0; index < map.length(); index++) {
			if (x - map.getWall(index).x > gameEnv.bound.w/2+100)
				continue;
			if (x - map.getWall(index).x < -(gameEnv.bound.w/2+240))
				continue;
			map.drawMap(index, -x + map.getWall(index).x + gameEnv.bound.w/2);

			if (helper.checkColision2Rect(getRectBound(),map.getWallBound(index))) {
				
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
        background.bx+=dx/2;
        spritesIndex+=0.1;
        if (spritesIndex>5)
            spritesIndex=0;
        //console.log(Math.round(spritesIndex));
    }
    
    function finishMoveLeft() {
        
    }
    
    function moveRight() {
        x-=dx;
        background.bx-=dx/2;
        spritesIndex-=0.1;
        if (spritesIndex<0)
            spritesIndex=4;
    }
    
    function drawBall()	{
			/*ctx.beginPath();
			ctx.rect(xconst, y, width, height);
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 0, 0, 1)";
			ctx.stroke();
			ctx.closePath();*/
            //ctx.drawImage(bgImage,bx,by,gameEnv.bound.w, gameEnv.bound.h, gameEnv.bound.x, gameEnv.bound.y, gameEnv.bound.w, gameEnv.bound.h);
            ctx.drawImage(sprites,Math.round(spritesIndex)*17+12,9,17,20,xconst,y,width,height);
		}
    //Public methods
    
    /*function() getJumping() {
			return jumping;
		}*/
    
	return {
		/*seter, getter*/
		move: function(e) {
			
			setStatus();
			
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

			drawBall();
		}
	}
}