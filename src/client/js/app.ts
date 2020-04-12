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
        _game.registerPlayerIO(UserIO.s)
        break;
      case "KeyW":
      case "ArrowUp":
        _game.registerPlayerIO(UserIO.w)
        break;
      case "KeyA":
      case "ArrowLeft":
        _game.registerPlayerIO(UserIO.a)
        break;
      case "KeyD":
      case "ArrowRight":
        _game.registerPlayerIO(UserIO.d)
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
        _game.deregisterPlayerIO(UserIO.s)
        break;
      case "KeyW":
      case "ArrowUp":
        _game.deregisterPlayerIO(UserIO.w)
        break;
      case "KeyA":
      case "ArrowLeft":
        _game.deregisterPlayerIO(UserIO.a)
        break;
      case "KeyD":
      case "ArrowRight":
        _game.deregisterPlayerIO(UserIO.d)
        break;
    }
  }
}