import {
  IJoinGame,
  IUserInput,
  PlayerCastIO,
  IUserMouseClick,
  Click
} from '../models/interfaces';
import { Point } from "./models/basicTypes";
import Player from "./player";
import Game from "./game";
import Ability from './hero/ability';
import * as AgonesSDK from '@google-cloud/agones-sdk';

export function clientJoinGame(socket: SocketIO.Socket, joinGame: IJoinGame): void {
  Player.create(socket.id, socket, joinGame.name, joinGame.heroId);
  Game.getInstance().currentFrame = 0;
}

export function registerPlayerCast(clientId: string, userInput: IUserInput): void {
  const player: Player = Game.getInstance().players.get(clientId);
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
  }
  if (ability != null) {
    ability.targetPosition = Point.createFromIPoint(userInput.cursorPosition);
    console.log(`Player casting ${ability.name}`);
    ability.cast();
  }
}

export function registerPlayerClick(clientId: string, clickEvent: IUserMouseClick): void {
  const player: Player = Game.getInstance().players.get(clientId);
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
export async function disconnect(socket: SocketIO.Socket): Promise<void> {
  console.log(`Client with id ${socket.id} has disconnected`);
  Game.getInstance().reset();
  if (process.env.AGONES) {
    // reset game server to ready state
    await agonesSDK.ready();
  }
}
