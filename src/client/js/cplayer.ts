import { IPlayer, IPoint } from '../../models/interfaces';
import Canvas from './canvas';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;

  constructor(id: string, point: IPoint) {
    this.id = id;
    this.position = point;
  }

  draw(canvas: Canvas): void {
    canvas.context.beginPath();
    canvas.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    canvas.context.stroke();
  }
}

export default CPlayer;
