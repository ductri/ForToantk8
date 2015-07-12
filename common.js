"use strict";

function Status() {
	this.canMoveLeft = false;
	this.canMoveRight = false;
	this.canMoveUp = false;
	this.canMoveDown = false;
	this.jumping = false;
	this.show = function () {
		console.log("can move left: "+this.canMoveLeft);
		console.log("can move right: "+this.canMoveRight);
		console.log("can move up: "+this.canMoveUp);
		console.log("can move down: "+this.canMoveDown);
		console.log("is jumping: "+this.jumping);
	}
}

function UserInput() {
	this.left=false;
	this.right=false;
	this.up=false;
	this.down=false;
	this.show=function()
	{
		console.log("want to move left: "+this.left);
		console.log("want to move right: "+this.right);
		console.log("want to move up: "+this.up);
		console.log("want to move down: "+this.down);
	}
}

function GameEnv(canvas) {
	this.bound = new helper.createRect(0,0,canvas.width, canvas.height);
	this.ballHeight = 50;
	this.ballWidth = 50;
	this.ballX = 350;
	this.ballDx = 6;
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