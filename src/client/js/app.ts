import * as io from 'socket.io-client';
import { registerSocket } from './socket';
import Game from './game';

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
