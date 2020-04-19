import { IPlayer, IPoint, IHealth } from '../../models/interfaces';
import CGamemap from './cgamemap';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;
  health: IHealth;

  constructor(player: IPlayer) {
    this.id = player.id;
    this.position = player.position;
    this.health = player.health;
  }

  draw(gamemap: CGamemap, position: IPoint): void {
    // draw player model
    gamemap.context.beginPath();
    gamemap.context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
    gamemap.context.strokeStyle = "black";
    gamemap.context.stroke();

    // draw health bar
    gamemap.context.beginPath();
    gamemap.context.lineWidth = 5;
    gamemap.context.strokeStyle = "red";
    const XStart = -10;
    const Xlength = 20;
    const YOffset = -16;
    const healthBarCurrent: number = Math.ceil(this.health.current / this.health.maximum) * Xlength;

    gamemap.context.moveTo(position.x + XStart, position.y + YOffset);
    gamemap.context.lineTo(position.x + XStart + healthBarCurrent, position.y + YOffset);
    gamemap.context.stroke();

    // display health text
    gamemap.context.font = "30px Arial";
    gamemap.context.fillText(`Health: ${this.health.current}`,10,30);
  }
}

export default CPlayer;
