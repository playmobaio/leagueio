import { IProjectile, ICircle } from "../../models/interfaces";
import CGameMap from './cgameMap';
import Camera from './camera';

class CProjectile implements IProjectile {
  id: string;
  model: ICircle;

  constructor(projectile: IProjectile, camera: Camera) {
    this.id = projectile.id;
    this.model = projectile.model;
    this.model.center = camera.getRelativePosition(this.model.center);
  }

  draw(gamemap: CGameMap): void {
    gamemap.context.beginPath();
    gamemap.context.arc(this.model.center.x, this.model.center.y, 10, 0, 2 * Math.PI);
    gamemap.context.strokeStyle = "green";
    gamemap.context.stroke();
  }
}

export default CProjectile;
