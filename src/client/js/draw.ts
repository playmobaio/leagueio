import { IPlayer, IProjectile } from '../../models/interfaces';
import CGameMap from './cgameMap';
import Camera from './camera';

function drawPlayer(gameMap: CGameMap, player: IPlayer, camera: Camera): void {
  const position = camera.getRelativePosition(player.model.center);

  // draw player model
  gameMap.context.beginPath();
  gameMap.context.arc(
    position.x,
    position.y,
    player.model.radius,
    0,
    2 * Math.PI);
  gameMap.context.strokeStyle = "black";
  gameMap.context.stroke();

  // draw health bar
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

function drawProjectile(gameMap: CGameMap, projectile: IProjectile, camera: Camera): void {
  const position = camera.getRelativePosition(projectile.position);
  gameMap.context.beginPath();
  gameMap.context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
  gameMap.context.strokeStyle = "green";
  gameMap.context.stroke();
}

function drawClientHealth(gameMap: CGameMap, clientPlayer: IPlayer): void {
  gameMap.context.font = "30px Arial";
  gameMap.context.fillText(`Health: ${clientPlayer.health.current}`, 10, 30);
}

export {
  drawPlayer,
  drawProjectile,
  drawClientHealth
}