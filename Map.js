function createMap() {
	var map=[];
    var groundHeight=500;
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
	createMapRandom(0);
	
	/* END OF CONSTRUCTOR*/
	return {
		length: function() {
			return map.length;
		},

		getWall: function(index) {
			return map[index];
		},
        
        getGroundHeight() {
            return groundHeight;
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