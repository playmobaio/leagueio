import { IProjectile, IPoint } from "../../models/interfaces";
import Canvas from './canvas';

class CProjectile implements IProjectile {
  id: string;
  position: IPoint;

  constructor(id: string, position: IPoint) {
    this.id = id;
    this.position = position;
  }

  draw(canvas: Canvas): void {
    canvas.context.beginPath();
    canvas.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    canvas.context.strokeStyle = "green";
    canvas.context.stroke();
  }
}

export default CProjectile;