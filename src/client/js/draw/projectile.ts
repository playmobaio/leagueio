import CGameMap from "../cgameMap";
import { IProjectile, IShape, ICircleModel } from '../../../models/interfaces';
import Camera from '../camera';
import { drawCircle } from './shape';

function drawProjectile(gameMap: CGameMap, projectile: IProjectile, camera: Camera): void {
  const position = camera.absoluteToRelativePosition(projectile.model.position);
  switch(projectile.model.type) {
  case IShape.Circle: {
    const circleModel = projectile.model as ICircleModel;
    drawCircle(gameMap, position, circleModel.radius, "green");
    break;
  }
  default: {
    console.log("unimplemented");
    break;
  }
  }
}

export {
  drawProjectile
}
