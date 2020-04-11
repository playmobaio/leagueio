import Player from "./models/player";
import Game from "./models/game";
import { Point } from './models/basicTypes';

function clientJoinGame(socket:SocketIO.Socket, io: SocketIO.Server): void {
  const game: Game = Game.getInstance();
  const point: Point = game.gamemap.randomMapPosition();
  const player: Player = new Player(socket.id, point, socket, io);
  Game.getInstance().addPlayer(player);
}

function disconnect(socket: SocketIO.Socket): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  Game.getInstance().removePlayer(socket.id);
}

export {
  clientJoinGame,
  disconnect
}