import { IProjectile, IPoint } from "../../models/interfaces";
import CGamemap from './cgamemap';

class CProjectile implements IProjectile {
  id: string;
  position: IPoint;

  constructor(projectile: IProjectile) {
    this.id = projectile.id;
    this.position = projectile.position;
  }

  draw(gamemap: CGamemap, position: IPoint): void {
    gamemap.context.beginPath();
    gamemap.context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
    gamemap.context.strokeStyle = "green";
    gamemap.context.stroke();
  }
}

export default CProjectile;
