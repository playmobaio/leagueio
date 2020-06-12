import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces";
import { registerSocket } from './socket';

document.getElementById("joinGame").onclick = async(): Promise<void> => {
  console.log("Initializing Socket");
  const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
  const heroId: HeroID = parseInt((document.getElementById("hero") as HTMLInputElement).value);
  const joinGame: IJoinGame = { name, heroId };

  const socket: SocketIO.Socket = io();
  await registerSocket(socket);
  socket.emit("C:JOIN_GAME", joinGame);
};
