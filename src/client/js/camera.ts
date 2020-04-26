import { IPoint, IPlayer } from '../../models/interfaces';
import CGameMap from './cgameMap';

export default class Camera {
  absolutePosition : IPoint;
  width : number;
  height: number;
  maxX: number;
  maxY: number;

  constructor(map: CGameMap, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maxX = map.layers.cols * map.layers.tileSize - width;
    this.maxY = map.layers.rows * map.layers.tileSize - height;
    this.absolutePosition = { x: 0, y: 0 };
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

  setFrameReference(player: IPlayer): void {
    const x: number = player.position.x - this.width / 2;
    const y: number = player.position.y - this.height / 2;

    // clamp values
    this.absolutePosition = {
      x: Math.max(0, Math.min(x, this.maxX)),
      y: Math.max(0, Math.min(y, this.maxY))
    };
  }
}
