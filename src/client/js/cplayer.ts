import { IPlayer, IHealth } from '../../models/interfaces';
import Canvas from './canvas';
import { Circle } from '../../server/models/basicTypes';

class CPlayer implements IPlayer {
  id: string;
  model: Circle;
  health: IHealth;

  constructor(player: IPlayer) {
    this.id = player.id;
    this.model = player.model;
    this.health = player.health;
  }

  draw(canvas: Canvas): void {
    // draw player model
    canvas.context.beginPath();
    canvas.context.arc(this.model.center.x, this.model.center.y, 10, 0, 2 * Math.PI);
    canvas.context.strokeStyle = "black";
    canvas.context.stroke();

    // draw health bar
    canvas.context.beginPath();
    canvas.context.lineWidth = 5;
    canvas.context.strokeStyle = "red";
    const XStart = -10;
    const Xlength = 20;
    const YOffset = -16;
    let healthBarSize: number = Math.ceil(this.health.current / this.health.maximum * Xlength);
    healthBarSize = Math.max(healthBarSize, 0);

    canvas.context.moveTo(this.model.center.x + XStart, this.model.center.y + YOffset);
    canvas.context.lineTo(
      this.model.center.x + XStart + healthBarSize,
      this.model.center.y + YOffset);
    canvas.context.stroke();

    // display health text
    canvas.context.font = "30px Arial";
    canvas.context.fillText(`Health: ${this.health.current}`,10,30);
  }
}

export default CPlayer;
