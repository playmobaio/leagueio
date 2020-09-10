import * as express from "express";
import * as path from "path";
import *  as socketController from "./socketController";
import { IJoinGame } from '../models/interfaces/iJoinGame';
import { IUserInput } from '../models/interfaces/iUserInput';
import { IUserMouseClick } from '../models/interfaces/iUserMouseClick';
import * as AgonesSDK from '@google-cloud/agones-sdk';
import * as apiController from "./apiController";
import * as Sentry from "@sentry/node";
import Game from './game';

const SENTRY_DSN = "https://72774f64d7884b3f996466e24412134e@o439719.ingest.sentry.io/5406960";

// Create the app
const app = express();
const agonesSDK = new AgonesSDK();
const game = new Game();

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("PlayMoba listening at http://" + host + ":" + port);
});

app.use(express.static(path.join(__dirname, "../client")));
app.get("/server", apiController.requestServer);
app.get("/scores", async(_, res) => {
  apiController.getTopScores(game, res);
});

app.get(`/mixpanel-proxy/*`, apiController.proxyMixpanelRequests);

const io = require("socket.io").listen(server);
io.sockets.on(
  "connect",
  function(socket: SocketIO.Socket) {
    console.log("We have a new client: " + socket.id);
    socket.on("C:JOIN_GAME", async(joinGame: IJoinGame) => {
      socketController.clientJoinGame(game, socket, joinGame);
    });
    socket.on("C:USER_CAST", (userInput: IUserInput) => {
      socketController.registerPlayerCast(game, socket.id, userInput);
    });
    socket.on("C:USER_MOUSE_CLICK", (userMouseClick: IUserMouseClick) => {
      socketController.registerPlayerClick(game, socket.id, userMouseClick);
    });
    socket.on('disconnect', async() => await socketController.disconnect(game, socket));
  }
);

const connectAgones = async(): Promise<void> => {
  // Connect game server to agones
  await agonesSDK.connect();
  // Health Check
  setInterval(() => {
    agonesSDK.health();
  }, 5000);
  // Game server is in ready state
  await agonesSDK.ready();
}

function connectSentry(): void {
  // Initialize sentry metric system
  Sentry.init({ dsn: SENTRY_DSN });
}

if (process.env.AGONES) {
  connectAgones();
}

if (process.env.IS_PRODUCTION) {
  connectSentry();
}
