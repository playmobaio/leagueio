var express = require("express");
var path = require("path");
var socketController = require("./socketController.js");

// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://" + host + ":" + port);
}

app.use(express.static(path.join(__dirname, "../client")));

var io = require("socket.io")(server);
io.sockets.on(
  "connect",
  function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("CLIENT:JOIN_GAME", () => socketController.clientJoinGame(socket, io));
    socket.on('disconnect', () => socketController.disconnect(socket, io));
  }
);