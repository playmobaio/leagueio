import Player from "./models/player";
import Game from "./models/game";
import { Point } from './models/basicTypes';
import { IUserInput, IUserMouseClick } from '../models/interfaces';

export function clientJoinGame(socket:SocketIO.Socket): void {
  const game: Game = Game.getInstance();
  const point: Point = game.gameMap.randomValidMapPosition();
  new Player(socket.id, point, socket);
}

export function clientUserMove(socket:SocketIO.Socket, userInput: IUserInput): void {
  const game: Game = Game.getInstance();
  game.updatePlayerVelocity(socket.id, userInput.io);
}

export function clientMouseClick(socket:SocketIO.Socket, userMouseClick: IUserMouseClick): void {
  const game: Game = Game.getInstance();
  const player: Player = game.players.get(socket.id);
  player?.registerAutoAttack(userMouseClick.cursorPosition);
}

export function disconnect(socket: SocketIO.Socket, io: SocketIO.Server): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  io.emit("S:PLAYER_DC", socket.id);
  Game.getInstance().removePlayer(socket.id);
}
