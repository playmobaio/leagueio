import * as io from 'socket.io-client';
import { registerSocket } from './socket';
import Game from './game';
import { UserIO } from '../../models/interfaces';

function gameLoop(): void {
  const game: Game = Game.getInstance();
  game.update();
  requestAnimationFrame(gameLoop);
}

document.getElementById("joinGame").onclick = (): void => {
  console.log("Initializing Socket");

  const socket: SocketIO.Socket = io();
  registerSocket(socket);
  socket.emit("C:JOIN_GAME");
  gameLoop();
};

window.onkeydown = (event): void => {
  event.preventDefault();
  const _game = Game.getInstance();
  if (_game.socket) {
    switch(event.code) {
      case "KeyS":
      case "ArrowDown":
        _game.registerPlayerIO(UserIO.down)
        break;
      case "KeyW":
      case "ArrowUp":
        _game.registerPlayerIO(UserIO.up)
        break;
      case "KeyA":
      case "ArrowLeft":
        _game.registerPlayerIO(UserIO.left)
        break;
      case "KeyD":
      case "ArrowRight":
        _game.registerPlayerIO(UserIO.right)
        break;
    }
  }
}

window.onkeyup = (event): void => {
  event.preventDefault();
  const _game = Game.getInstance();
  if (_game.socket) {
    switch(event.code) {
      case "KeyS":
      case "ArrowDown":
        _game.deregisterPlayerIO(UserIO.down)
        break;
      case "KeyW":
      case "ArrowUp":
        _game.deregisterPlayerIO(UserIO.up)
        break;
      case "KeyA":
      case "ArrowLeft":
        _game.deregisterPlayerIO(UserIO.left)
        break;
      case "KeyD":
      case "ArrowRight":
        _game.deregisterPlayerIO(UserIO.right)
        break;
    }
  }
}