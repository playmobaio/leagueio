import { IPlayer, IPoint, IHealth } from '../../models/interfaces';
import CGameMap from './cgameMap';

class CPlayer implements IPlayer {
  id: string;
  position: IPoint;
  health: IHealth;

  constructor(player: IPlayer) {
    this.id = player.id;
    this.position = player.position;
    this.health = player.health;
  }

  draw(gameMap: CGameMap): void {
    // draw player model
    gameMap.context.beginPath();
    gameMap.context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    gameMap.context.strokeStyle = "black";
    gameMap.context.stroke();

    // draw health bar
    gameMap.context.beginPath();
    gameMap.context.lineWidth = 5;
    gameMap.context.strokeStyle = "red";
    const XStart = -10;
    const Xlength = 20;
    const YOffset = -16;
    const healthBarCurrent: number = Math.ceil(this.health.current / this.health.maximum) * Xlength;

    gameMap.context.moveTo(this.position.x + XStart, this.position.y + YOffset);
    gameMap.context.lineTo(this.position.x + XStart + healthBarCurrent, this.position.y + YOffset);
    gameMap.context.stroke();

    // display health text
    gameMap.context.font = "30px Arial";
    gameMap.context.fillText(`Health: ${this.health.current}`,10,30);
  }
}

export default CPlayer;
