import * as express from "express";
import * as path from "path";
import *  as socketController from "./socketController";
import Game from './models/game';
import { IUserInput, IUserMouseClick, IGameState } from '../models/interfaces';
import constants from './constants';
import { EmitEvent } from './tools/emitEvent';

// Create the app
const app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://" + host + ":" + port);
});

app.use(express.static(path.join(__dirname, "../client")));

const io = require("socket.io").listen(server);
const game: Game = Game.getInstance();

io.sockets.on(
  "connect",
  function(socket: SocketIO.Socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("C:JOIN_GAME", () => socketController.clientJoinGame(socket));
    socket.on("C:USER_MOVE", (userInput: IUserInput) => {
      return userInput;
    });
    socket.on("C:USER_MOUSE_CLICK", (userMouseClick: IUserMouseClick) => {
      game.emitter.emit(EmitEvent.RegisterUserClick, socket.id, userMouseClick);
    });
    socket.on('disconnect', () => socketController.disconnect(socket, io));
  }
);

setInterval(() => {
  game.update();
  const gameState: Array<IGameState> = game.getGameStates();
  game.sendGameStates(gameState);
}, 1000 / constants.FRAMES_PER_SECOND) // 60 frames a second
