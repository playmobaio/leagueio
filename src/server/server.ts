import * as express from "express";
import * as path from "path";
import *  as socketController from "./socketController";

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
io.sockets.on(
  "connect",
  function(socket: SocketIO.Socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("CLIENT:JOIN_GAME", () => {
      socketController.clientJoinGame(socket, io);
    });
    socket.on('disconnect', () => socketController.disconnect(socket, io));
  }
);
