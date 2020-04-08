function joinGame() {
  console.log("Initializing Socket");
  var socket = io();
  registerSocket(socket);

  var name = document.getElementById("playerNameInput");
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";
  socket.emit("CLIENT:JOIN_GAME");
};

function registerSocket(socket) {
  socket.on("SERVER:PLAYER_CREATED", (state) => {
    _game.players = state.players.map(p => Player(p.id, p.x, p.y));
    _game.removePlayer(socket.id);

    // TODO: We should refactor this when we update the event loop also update server
    if (socket.id == state.generated.id) {
      const player = Player(socket.id, state.generated.x, state.generated.y);
      _game.user = player;
      startNewGame();
      setInterval(update,40);
    }
  });

  socket.on("SERVER:PLAYER_DC", (id) => {
    _game.removePlayer(id);
  })
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var TILE_SIZE = 32;
var WIDTH = 640;
var HEIGHT = 360;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 360;
var timeWhenGameStarted = Date.now();	//return time in ms

let resizeCanvas = function() {
  CANVAS_WIDTH = window.innerWidth - 4;
  CANVAS_HEIGHT = window.innerHeight - 4;

  let ratio = 16 / 9;
  if(CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
  CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
  else
  CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.font = "30px Arial";
  ctx.mozImageSmoothingEnabled = false;	//better graphics for pixel art
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  canvas.style.width = "" + CANVAS_WIDTH + "px";
  canvas.style.height = "" + CANVAS_HEIGHT + "px";
}
resizeCanvas();

window.addEventListener("resize",function(){
  resizeCanvas();
});


var frameCount = 0;

var score = 0;

var paused = false;

var Img = {};
Img.player = new Image();
Img.player.src = "img/player.png";
//Img.player.src = "img/evan.png";
Img.bat = new Image();
Img.bat.src = "img/bat.png";
Img.bee = new Image();
Img.bee.src = "img/bee.png";
Img.bullet = new Image();
Img.bullet.src = "img/bullet.png";

Img.bulletPlayer = new Image();
Img.bulletPlayer.src = "img/evan.png";


Img.upgrade1 = new Image();
Img.upgrade1.src = "img/upgrade1.png";
Img.upgrade2 = new Image();
Img.upgrade2.src = "img/upgrade2.png";

function testCollisionRectRect(rect1,rect2) {
	return rect1.x <= rect2.x+rect2.width
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

document.onmousedown = function(mouse) {
  if (!_game.user)
    return
	if(mouse.which === 1)
		_game.user.pressingMouseLeft = true;
	else
		_game.user.pressingMouseRight = true;
}
document.onmouseup = function(mouse) {
  if (!_game.user)
    return
	if(mouse.which === 1)
		_game.user.pressingMouseLeft = false;
	else
		_game.user.pressingMouseRight = false;
}
document.oncontextmenu = function(mouse) {
  if (!_game.user)
    return
	mouse.preventDefault();
}

document.onmousemove = function(mouse) {
  if (!_game.user)
    return
	var mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
	var mouseY = mouse.clientY - canvas.getBoundingClientRect().top;

	mouseX -= CANVAS_WIDTH/2;
	mouseY -= CANVAS_HEIGHT/2;

	_game.user.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180;
}

document.onkeydown = function(event) {
  if (!_game.user)
    return
	if(event.keyCode === 68)	//d
		_game.user.pressingRight = true;
	else if(event.keyCode === 83)	//s
		_game.user.pressingDown = true;
	else if(event.keyCode === 65) //a
		_game.user.pressingLeft = true;
	else if(event.keyCode === 87) // w
		_game.user.pressingUp = true;

	else if(event.keyCode === 80) //p
		paused = !paused;
}

document.onkeyup = function(event) {
  if (!_game.user)
    return
	if(event.keyCode === 68)	//d
		_game.user.pressingRight = false;
	else if(event.keyCode === 83)	//s
		_game.user.pressingDown = false;
	else if(event.keyCode === 65) //a
		_game.user.pressingLeft = false;
	else if(event.keyCode === 87) // w
		_game.user.pressingUp = false;
}

function update() {
	if(paused){
		ctx.fillText("Paused",WIDTH/2,HEIGHT/2);
		return;
	}

	ctx.clearRect(0,0,WIDTH,HEIGHT);
	Maps.current.draw();
	frameCount++;
	score++;


	Bullet.update();
	Upgrade.update();
	Enemy.update();

  _game.players.forEach((p) => { p.update(); })
  _game.user.update();

	ctx.fillText(_game.user.hp + " Hp",0,30);
	ctx.fillText("Score: " + score,200,30);
}

function startNewGame() {
  _game.user.hp = 10;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	Enemy.list = {};
	Upgrade.list = {};
	Bullet.list = {};
	Enemy.randomlyGenerate();
	Enemy.randomlyGenerate();
	Enemy.randomlyGenerate();
}

Maps = function(id,imgSrc,grid){
	var self = {
		id:id,
		image:new Image(),
		width:grid[0].length * TILE_SIZE,
		height:grid.length * TILE_SIZE,
		grid:grid,
	}
	self.image.src = imgSrc;

	self.isPositionWall = function(pt){
		var gridX = Math.floor(pt.x / TILE_SIZE);
		var gridY = Math.floor(pt.y / TILE_SIZE);
		if(gridX < 0 || gridX >= self.grid[0].length)
			return true;
		if(gridY < 0 || gridY >= self.grid.length)
			return true;
		return self.grid[gridY][gridX];
	}

	self.draw = function(){
		var x = WIDTH/2 - _game.user.x;
		var y = HEIGHT/2 - _game.user.y;
		ctx.drawImage(self.image,0,0,self.image.width,self.image.height,x,y,self.image.width*2,self.image.height*2);
	}
	return self;
}

var array = Array.from(Array(1600), () => 0);

var array2D = [];
for(var i = 0 ; i < 40; i++){
	array2D[i] = [];
	for(var j = 0 ; j < 40; j++){
		array2D[i][j] = array[i * 40 + j];
	}
}

Maps.current = Maps("field","img/white.png",array2D);
