var Player = require("./Player");

module.exports = {
  clientJoinGame : function(socket, io, players) {
    var player = new Player(socket.id);
    players.push(player);
    io.emit("SERVER:PLAYER_CREATED", {
      generated: player,
      players: players
    });
  },
  disconnect : function() {
    console.log('Client has disconnected');
  }
}