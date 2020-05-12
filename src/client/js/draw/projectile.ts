import CGameMap from "../cgameMap";
import { IProjectile } from '../../../models/interfaces';
import Camera from '../camera';

function drawProjectile(gameMap: CGameMap, projectile: IProjectile, camera: Camera): void {
  const position = camera.getRelativePosition(projectile.position);
  gameMap.context.beginPath();
  gameMap.context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
  gameMap.context.strokeStyle = "green";
  gameMap.context.stroke();
}

export {
  drawProjectile
}