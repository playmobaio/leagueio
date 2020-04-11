import * as io from 'socket.io-client';
import { registerSocket } from './socket';
import Game from './game';

document.getElementById("joinGame").onclick = (): void => {
  console.log("Initializing Socket");

  const socket = io();
  registerSocket(socket);
  socket.emit("C:JOIN_GAME");

  const _game = Game.getInstance();
  _game.startGame();
};
