import * as express from "express";
import * as path from "path";
import *  as socketController from "./socketController";
import Game from './game';
import { IGameState } from '../models/interfaces/iGameState';
import { IJoinGame } from '../models/interfaces/iJoinGame';
import { IUserInput } from '../models/interfaces/iUserInput';
import { IUserMouseClick } from '../models/interfaces/iUserMouseClick';
import constants from './constants';
import * as AgonesSDK from '@google-cloud/agones-sdk';
import * as apiController from "./apiController";

// Create the app
const app = express();
const agonesSDK = new AgonesSDK();

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://" + host + ":" + port);
});

app.use(express.static(path.join(__dirname, "../client")));
app.get("/server", apiController.requestServer);

const io = require("socket.io").listen(server);
const game: Game = Game.getInstance();
io.sockets.on(
  "connect",
  function(socket: SocketIO.Socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("C:JOIN_GAME", async(joinGame: IJoinGame) => {
      socketController.clientJoinGame(socket, joinGame);
    });
    socket.on("C:USER_CAST", (userInput: IUserInput) => {
      socketController.registerPlayerCast(socket.id, userInput);
    });
    socket.on("C:USER_MOUSE_CLICK", (userMouseClick: IUserMouseClick) => {
      socketController.registerPlayerClick(socket.id, userMouseClick);
    });
    socket.on('disconnect', async() => await socketController.disconnect(socket));
  }
);

setInterval(() => {
  game.update();
  const gameState: Array<IGameState> = game.getGameStates();
  game.sendGameStates(gameState);
}, 1000 / constants.FRAMES_PER_SECOND) // 60 frames a second

const connectAgones = async(): Promise<void> => {
  // Connect game server to agones
  await agonesSDK.connect();
  // Health Check
  setInterval(() => {
    agonesSDK.health();
    console.log('Health ping sent');
  }, 20000);
  // Game server is in ready state
  await agonesSDK.ready();
}

if (process.env.AGONES) {
  connectAgones();
}
