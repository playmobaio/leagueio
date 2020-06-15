import CGameMap from "../cgameMap";
import { IPlayer, IPoint } from '../../../models/interfaces';
import Camera from '../camera';
import { drawCircle } from './shape';

function drawPlayerModel(gameMap: CGameMap, player: IPlayer, position: IPoint): void {
  gameMap.context.beginPath();
  const model = player.hero.model;
  drawCircle(gameMap, position, model.radius, "black", true);
}

function drawHealthBar(gameMap: CGameMap, player: IPlayer, position: IPoint): void {
  gameMap.context.beginPath();
  gameMap.context.strokeStyle = "red";
  const XStart = -10;
  const Xlength = 20;
  const YOffset = -player.hero.model.radius - 8;
  let healthBarSize: number = Math.ceil(player.health.current / player.health.maximum * Xlength);
  healthBarSize = Math.max(healthBarSize, 0);

  gameMap.context.moveTo(position.x + XStart, position.y + YOffset);
  gameMap.context.lineTo(
    position.x + XStart + healthBarSize,
    position.y + YOffset);
  gameMap.context.stroke();
}

function drawPlayer(gameMap: CGameMap, player: IPlayer, camera: Camera): void {
  const position = camera.getRelativePosition(player.hero.model.origin);
  gameMap.context.lineWidth = 5;
  drawPlayerModel(gameMap, player, position);
  drawHealthBar(gameMap, player, position);
}

export {
  drawPlayer
}