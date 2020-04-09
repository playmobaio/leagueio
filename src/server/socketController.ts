import Player from "./player";
import Game from "./game";

function clientJoinGame(socket:SocketIO.Socket, io: SocketIO.Server): void {
  const player: Player = new Player(socket.id);
  Game.getInstance().addPlayer(player);

  io.emit("SERVER:PLAYER_CREATED", {
    generated: player,
    players: Game.getInstance().getPlayers()
  });
}

function disconnect(socket: SocketIO.Socket, io: SocketIO.Server): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  Game.getInstance().removePlayer(socket.id);
  io.emit("SERVER:PLAYER_DC", socket.id);
}

export { 
  clientJoinGame, 
  disconnect 
}