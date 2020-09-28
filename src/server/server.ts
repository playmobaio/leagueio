import * as express from "express";
import * as path from "path";
import *  as socketController from "./socketController";
import { IJoinGame } from '../models/interfaces/iJoinGame';
import { IUserInput } from '../models/interfaces/iUserInput';
import { IUserMouseClick } from '../models/interfaces/iUserMouseClick';
import * as AgonesSDK from '@google-cloud/agones-sdk';
import * as apiController from "./apiController";
import * as Sentry from "@sentry/node";
import * as Mixpanel from "mixpanel";
import MixpanelEvents from "./mixpanelEvents";
import constants from "../models/constants";
import Game from './game';
import { App } from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';

const SENTRY_DSN = "https://72774f64d7884b3f996466e24412134e@o439719.ingest.sentry.io/5406960";

// Create the app
const app = express();
const agonesSDK = new AgonesSDK();
const game = new Game();
let mixpanel;

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

const uWs = App();
uWs.listen(parseInt(process.env.SOCKET_PORT) || 3001, function() {
  console.log("PlayMoba started uWebsocket Server");
})
uWs.ws('/*', {
  compression: 0,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 10,
  open: (ws): void => {
    ws.id = uuidv4();
  },
  message: (ws, message, isBinary) => {
    // console.log(['server.ws.message'], message, isBinary);
    const enc = new TextDecoder('utf-8');
    const { action, topic, data } = JSON.parse(enc.decode(message));

    console.log(['enc.decode(message)'], { action, topic, data });

    if (topic as Topic === 'counter') {
      if (action as CounterAction === 'increment') {
        counter++;

        ws.publish('home/sensors/temperature', message);
        ws.publish('counter', JSON.stringify({ action: 'update', topic: '', data: counter }));
        ws.send(JSON.stringify({ action: 'update', topic: 'counter', data: counter }));
      }
    }
  },
  close: (ws: WebSocket, code: number, message: ArrayBuffer) => {

  }
});

const io = require("socket.io").listen(server);
io.sockets.on(
  "connect",
  function(socket: SocketIO.Socket) {
    console.log("We have a new client: " + socket.id);
    socket.on("C:JOIN_GAME", async(joinGame: IJoinGame) => {
      socketController.clientJoinGame(game, socket, joinGame);
      mixpanel.track(MixpanelEvents.START_GAME, { ip: socket.handshake.address });
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

const mixpanelConfig = { protocol: 'https' };
if (process.env.IS_PRODUCTION) {
  connectSentry();
  mixpanel = Mixpanel.init(constants.MIXPANEL_PROD_TOKEN, mixpanelConfig);
} else {
  mixpanel = Mixpanel.init(constants.MIXPANEL_DEV_TOKEN, mixpanelConfig);
}
