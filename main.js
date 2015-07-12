//GAME INIT
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var helper = createHelper();
var gameEnv = new GameEnv(canvas);
var sprites = document.getElementById("sprites");
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
//END OF GAME INIT
var background = new Background(gameEnv);
var map = createMap();

var myPlayer = createPlayer(gameEnv, map, background);

var userInput = new UserInput();

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



function mainLoop() {
    ctx.clearRect(0,0,gameEnv.bound.w,gameEnv.bound.h);
    
    background.drawBackground();
    
	myPlayer.move();
	
	window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);
