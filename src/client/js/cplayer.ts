import { IPlayer, IPoint, IHealth } from '../../models/interfaces';
import Canvas from './canvas';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;
  health: IHealth;

  constructor(id: string, point: IPoint) {
    this.id = id;
    this.position = point;
    this.health = { current: 100, maximum: 100 };
  }

  draw(canvas: Canvas): void {
    // draw player model
    canvas.context.beginPath();
    canvas.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    canvas.context.strokeStyle = "black";
    canvas.context.stroke();

    // draw health bar
    canvas.context.beginPath();
    canvas.context.lineWidth = 5;
    canvas.context.strokeStyle = "red";
    const XStart = -10;
    const Xlength = 20;
    const YOffset = -16;
    const healthBarCurrent: number = Math.ceil(this.health.current / this.health.maximum) * Xlength;

    canvas.context.moveTo(this.position.x + XStart, this.position.y + YOffset);
    canvas.context.lineTo(this.position.x + XStart + healthBarCurrent, this.position.y + YOffset);
    canvas.context.stroke();

    // display health text
    canvas.context.font = "30px Arial";
    canvas.context.fillText(`Health: ${this.health.current}`,10,30);
  }
}

export default CPlayer;
