import Player from "./models/player";
import Game from "./models/game";

export function clientJoinGame(socket: SocketIO.Socket): void {
  Player.create(socket.id, socket);
}

export function disconnect(socket: SocketIO.Socket, io: SocketIO.Server): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  io.emit("S:PLAYER_DC", socket.id);
  Game.getInstance().removePlayer(socket.id);
}
