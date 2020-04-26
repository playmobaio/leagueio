import * as io from 'socket.io-client';
import { registerSocket } from './socket';

document.getElementById("joinGame").onclick = async(): Promise<void> => {
  console.log("Initializing Socket");

  const socket: SocketIO.Socket = io();
  await registerSocket(socket);
  socket.emit("C:JOIN_GAME");
};
