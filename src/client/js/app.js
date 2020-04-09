function joinGame() {
  console.log("Initializing Socket");
  var socket = io();
  registerSocket(socket);

  var name = document.getElementById("playerNameInput");
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("startpanel").style.visibility = "hidden";
  socket.emit("CLIENT:JOIN_GAME");
};

function registerSocket(socket) {
  socket.on("SERVER:PLAYER_CREATED", (state) => {
    _game.players = state.players.map(p => Player(p.id, p.x, p.y));
    _game.removePlayer(socket.id);

    // TODO: We should refactor this when we update the event loop also update server
    if (socket.id == state.generated.id) {
      const player = Player(socket.id, state.generated.x, state.generated.y);
      _game.user = player;
      startNewGame();
      setInterval(update,40);
    }
  });

  socket.on("SERVER:PLAYER_DC", (id) => {
    _game.removePlayer(id);
  })
}
