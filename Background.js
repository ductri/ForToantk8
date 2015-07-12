function Background(gameEnv) {
    this.bgImage=document.getElementById("bgImage");
    
    
    
    this.bx=0;
    this.by=bgImage.naturalHeight-gameEnv.bound.h;
    this.gameEnv = gameEnv;
    this.groundHeight = gameEnv.bound.h - 125;
    this.drawBackground = function() {
        ctx.drawImage(bgImage,this.bx,this.by,gameEnv.bound.w, gameEnv.bound.h, gameEnv.bound.x, gameEnv.bound.y, gameEnv.bound.w, gameEnv.bound.h);
    }
}