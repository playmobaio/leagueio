import * as io from 'socket.io-client';
import { registerSocket } from './socket';

document.getElementById("joinGame").onclick = (): void => {
  console.log("Initializing Socket");

  const socket: SocketIO.Socket = io();
  registerSocket(socket);
  socket.emit("C:JOIN_GAME");
};
