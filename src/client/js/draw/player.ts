import CGameMap from "../cgameMap";
import { IPlayer, IPoint } from '../../../models/interfaces';
import Camera from '../camera';

function drawPlayerModel(gameMap: CGameMap, player: IPlayer, position: IPoint): void {
  gameMap.context.beginPath();
  gameMap.context.arc(
    position.x,
    position.y,
    player.model.radius,
    0,
    2 * Math.PI);
  gameMap.context.strokeStyle = "black";
  gameMap.context.stroke();
}

function drawHealthBar(gameMap: CGameMap, player: IPlayer, position: IPoint): void {
  gameMap.context.beginPath();
  gameMap.context.lineWidth = 5;
  gameMap.context.strokeStyle = "red";
  const XStart = -10;
  const Xlength = 20;
  const YOffset = -player.model.radius - 8;
  let healthBarSize: number = Math.ceil(player.health.current / player.health.maximum * Xlength);
  healthBarSize = Math.max(healthBarSize, 0);

  gameMap.context.moveTo(position.x + XStart, position.y + YOffset);
  gameMap.context.lineTo(
    position.x + XStart + healthBarSize,
    position.y + YOffset);
  gameMap.context.stroke();
}

function drawPlayer(gameMap: CGameMap, player: IPlayer, camera: Camera): void {
  const position = camera.getRelativePosition(player.model.center);
  drawPlayerModel(gameMap, player, position);
  drawHealthBar(gameMap, player, position);
}

export {
  drawPlayer
}