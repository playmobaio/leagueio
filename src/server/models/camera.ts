import { IPoint } from '../../models/interfaces';
import GameMap from './gameMap';
import Player from './player';

export default class Camera {
  absolutePosition : IPoint;
  width : number;
  height: number;
  maxX: number;
  maxY: number;
  realtivePosition: IPoint;

  constructor(map: GameMap, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tileSize - width;
    this.maxY = map.rows * map.tileSize - height;
    this.absolutePosition = { x: 0, y: 0 };
    this.realtivePosition = { x: 0, y: 0 };
  }

  getRelativePosition(absolutePosition: IPoint): IPoint {
    return {
      x: absolutePosition.x - this.absolutePosition.x,
      y: absolutePosition.y - this.absolutePosition.y
    };
  }

  getAbsolutePosition(relativePosition: IPoint): IPoint {
    return {
      x: relativePosition.x + this.absolutePosition.x,
      y: relativePosition.y + this.absolutePosition.y
    };
  }

  update(player: Player): void {
    const playerPosition: IPoint = player.position;
    if (playerPosition == null) {
      return;
    }
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.realtivePosition.x = this.width / 2;
    this.realtivePosition.y = this.height / 2

    const x: number = playerPosition.x - this.width / 2;
    const y: number = playerPosition.y - this.height / 2;

    // clamp values
    this.absolutePosition = {
      x: Math.max(0, Math.min(x, this.maxX)),
      y: Math.max(0, Math.min(y, this.maxY))
    };

    if (this.absolutePosition.x != x) {
      this.realtivePosition.x = playerPosition.x - this.absolutePosition.x;
    }

    if (this.absolutePosition.y != y) {
      this.realtivePosition.y = playerPosition.y - this.absolutePosition.y;
    }
  }
}
