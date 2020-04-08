var Player = require("./player.js");
var Game = require("./game.js");

module.exports = {
  clientJoinGame : function(socket, io) {
    const player = new Player(socket.id);
    Game.addPlayer(player);
    io.emit("SERVER:PLAYER_CREATED", {
      generated: player,
      players: Game.getPlayers()
    });
  },
  disconnect : function(socket, io) {
    console.log(`Client with id ${socket.id} has disconnected`);
    Game.removePlayer(socket.id);
    io.emit("SERVER:PLAYER_DC", socket.id);
  }
}