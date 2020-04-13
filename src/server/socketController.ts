import Player from "./models/player";
import Game from "./models/game";
import { Point } from './models/basicTypes';
import { IUserInput } from '../models/interfaces';

export function clientJoinGame(socket:SocketIO.Socket): void {
  const game: Game = Game.getInstance();
  const point: Point = game.gamemap.randomMapPosition();
  const player: Player = new Player(socket.id, point, socket);
  Game.getInstance().addPlayer(player);
}

export function clientUserMove(socket:SocketIO.Socket, userInput: IUserInput): void {
  const game: Game = Game.getInstance();
  game.movePlayer(socket.id, userInput.io);
  game.addProjectile(socket.id, userInput.position);
}

export function disconnect(socket: SocketIO.Socket, io: SocketIO.Server): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  io.emit("S:PLAYER_DC", socket.id);
  Game.getInstance().removePlayer(socket.id);
}