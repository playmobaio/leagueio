import CGameMap from "../cgameMap";
import { IProjectile } from '../../../models/interfaces';
import Camera from '../camera';
import { drawCircle } from './shape';

function drawProjectile(gameMap: CGameMap, projectile: IProjectile, camera: Camera): void {
  const position = camera.getRelativePosition(projectile.model.origin);
  drawCircle(gameMap, position, projectile.model.radius, "green");
}

export {
  drawProjectile
}