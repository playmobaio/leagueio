import Player from "./models/player";
import Game from "./models/game";
import { IJoinGame, IUserInput, PlayerCastIO, IUserMouseClick, Click } from '../models/interfaces';

export function clientJoinGame(socket: SocketIO.Socket, joinGame: IJoinGame): void {
  Player.create(socket.id, socket, joinGame.name, joinGame.heroId);
}

export function registerPlayerCast(clientId: string, userInput: IUserInput): void {
  console.log("Player casting");
  const player: Player = Game.getInstance().players.get(clientId);
  switch(userInput.io) {
  case PlayerCastIO.Q:
    player?.hero?.qAbility?.cast();
    break;
  case PlayerCastIO.W:
    player?.hero?.wAbility?.cast();
    break;
  case PlayerCastIO.E:
    player?.hero?.eAbility?.cast();
    break;
  }
}

export function registerPlayerClick(clientId: string, clickEvent: IUserMouseClick): void {
  console.log("Player clicking");
  const player: Player = Game.getInstance().players.get(clientId);
  switch(clickEvent.click) {
  case Click.Left:
    player?.hero?.performAutoAttack(clickEvent.cursorPosition);
    break;
  case Click.Right:
    player?.hero?.updateVelocity(clickEvent.cursorPosition);
    break;
  }
}

export function disconnect(socket: SocketIO.Socket, io: SocketIO.Server): void {
  console.log(`Client with id ${socket.id} has disconnected`);
  io.emit("S:PLAYER_DC", socket.id);
  Game.getInstance().removePlayer(socket.id);
}
