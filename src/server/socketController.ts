import { IUserInput, PlayerCastIO } from '../models/interfaces/iUserInput';
import { IJoinGame } from '../models/interfaces/iJoinGame';
import { IUserMouseClick, Click } from '../models/interfaces/iUserMouseClick';
import { Point } from "./models/basicTypes";
import Player from "./player";
import Game from "./game";
import Ability from './hero/ability';
import * as AgonesSDK from '@google-cloud/agones-sdk';

export function clientJoinGame(game: Game, socket: SocketIO.Socket, joinGame: IJoinGame): void {
  Player.create(game, socket.id, socket, joinGame.name, joinGame.heroId);
  game.start();
}

export function registerPlayerCast(game: Game, clientId: string, userInput: IUserInput): void {
  const player: Player = game.players.get(clientId);
  let ability: Ability;
  switch(userInput.io) {
  case PlayerCastIO.Q:
    ability = player?.hero?.qAbility;
    break;
  case PlayerCastIO.W:
    ability = player?.hero?.wAbility;
    break;
  case PlayerCastIO.E:
    ability = player?.hero?.eAbility;
    break;
  case PlayerCastIO.D:
    ability = player?.dAbility;
    break;
  case PlayerCastIO.F:
    ability = player?.fAbility;
    break;
  }
  if (ability != null) {
    ability.targetPosition = Point.createFromIPoint(userInput.cursorPosition);
    console.log(`Player casting ${ability.name}`);
    ability.cast();
  }
}

export function registerPlayerClick(
  game: Game,
  clientId: string,
  clickEvent: IUserMouseClick): void {

  const player: Player = game.players.get(clientId);
  const cursorPoint = new Point(clickEvent.cursorPosition.x, clickEvent.cursorPosition.y)
  switch(clickEvent.click) {
  case Click.Left:
    player?.hero.performAttack(cursorPoint);
    break;
  case Click.Right:
    player?.hero.updateVelocity(cursorPoint);
    break;
  }
}

// declared outside so we can reuse the client
const agonesSDK = new AgonesSDK();
export async function disconnect(game: Game, socket: SocketIO.Socket): Promise<void> {
  console.log(`Client with id ${socket.id} has disconnected`);
  game.reset();
  if (process.env.AGONES) {
    // reset game server to ready state
    await agonesSDK.ready();
  }
}
