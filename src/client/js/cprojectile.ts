import { IProjectile, IPoint } from "../../models/interfaces";
import CGameMap from './cgameMap';
import Camera from './camera';

class CProjectile implements IProjectile {
  id: string;
  position: IPoint;

  constructor(projectile: IProjectile, camera: Camera) {
    this.id = projectile.id;
    this.position = camera.getRelativePosition(projectile.position);
  }

  draw(gamemap: CGameMap): void {
    gamemap.context.beginPath();
    gamemap.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    gamemap.context.strokeStyle = "green";
    gamemap.context.stroke();
  }
}

export default CProjectile;
