import Player from "./models/player";
import Game from "./models/game";
import { Point } from "../types/basicTypes";

function clientJoinGame(socket:SocketIO.Socket, io: SocketIO.Server): void {
  const game: Game = Game.getInstance();
  const point: Point = game.map.randomMapPosition();
  const player: Player = new Player(socket.id, point);
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