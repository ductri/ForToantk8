function Status() {
	this.canMoveLeft=false;
	this.canMoveRight=false;
	this.canMoveUp=false;
	this.canMoveDown=false;
	this.jumping=false;
	this.show=function()
	{
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
	this.ballDx = 2.5;

}