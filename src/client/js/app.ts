import * as io from 'socket.io-client';
import { registerSocket } from './socket';
import Game from './game';
import constants from './constants';
import { UserIO } from '../../models/interfaces';

document.getElementById("joinGame").onclick = (): void => {
  console.log("Initializing Socket");

  const socket: SocketIO.Socket = io();
  registerSocket(socket);
  socket.emit("C:JOIN_GAME");

  const _game = Game.getInstance();
  _game.startGame();
};

document.onkeydown = (event): void => {
  const _game = Game.getInstance();
  if (_game.socket) {
    if(event.keyCode === constants.d)
      _game.registerPlayerIO(UserIO.d)
    else if(event.keyCode === constants.s)
      _game.registerPlayerIO(UserIO.s)
    else if(event.keyCode === constants.a)
      _game.registerPlayerIO(UserIO.a)
    else if(event.keyCode === constants.w)
      _game.registerPlayerIO(UserIO.w)
  }
}

document.onkeyup = (event): void => {
  const _game = Game.getInstance();
  if (_game.socket) {
    if(event.keyCode === constants.d)
      _game.registerPlayerIO(UserIO.d)
    else if(event.keyCode === constants.s)
      _game.registerPlayerIO(UserIO.s)
    else if(event.keyCode === constants.a)
      _game.registerPlayerIO(UserIO.a)
    else if(event.keyCode === constants.w)
      _game.registerPlayerIO(UserIO.w)
  }
}