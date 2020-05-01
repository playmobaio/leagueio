import { IPlayer, IHealth, ICircle } from '../../models/interfaces';
import CGameMap from './cgameMap';
import Camera from './camera';

class CPlayer implements IPlayer {
  id: string;
  model: ICircle;
  health: IHealth;

  constructor(player: IPlayer, camera: Camera) {
    this.id = player.id;
    this.model = player.model;
    this.model.center = camera.getRelativePosition(player.model.center);
    this.health = player.health;
  }

  draw(gameMap: CGameMap): void {
    // draw player model
    gameMap.context.beginPath();
    gameMap.context.arc(
      this.model.center.x,
      this.model.center.y,
      this.model.radius,
      0,
      2 * Math.PI);
    gameMap.context.strokeStyle = "black";
    gameMap.context.stroke();

    // draw health bar
    gameMap.context.beginPath();
    gameMap.context.lineWidth = 5;
    gameMap.context.strokeStyle = "red";
    const XStart = -10;
    const Xlength = 20;
    const YOffset = -16;
    let healthBarSize: number = Math.ceil(this.health.current / this.health.maximum * Xlength);
    healthBarSize = Math.max(healthBarSize, 0);

    gameMap.context.moveTo(this.model.center.x + XStart, this.model.center.y + YOffset);
    gameMap.context.lineTo(
      this.model.center.x + XStart + healthBarSize,
      this.model.center.y + YOffset);
    gameMap.context.stroke();

    // display health text
    gameMap.context.font = "30px Arial";
    gameMap.context.fillText(`Health: ${this.health.current}`,10,30);
  }
}

export default CPlayer;
