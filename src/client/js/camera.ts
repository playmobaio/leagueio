import { IPoint, IPlayer } from '../../models/interfaces';
import CGameMap from './cgameMap';

export default class Camera {
  absolutePosition: IPoint;
  width: number;
  height: number;
  maxX: number;
  maxY: number;

  constructor(map: CGameMap, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maxX = map.layers.width - width;
    this.maxY = map.layers.height - height;
    this.absolutePosition = { x: 0, y: 0 };
  }

  absoluteToRelativePosition(absolutePosition: IPoint): IPoint {
    return {
      x: absolutePosition.x - this.absolutePosition.x,
      y: absolutePosition.y - this.absolutePosition.y
    };
  }

  getAbsolutePosition(canvasWidth: number, canvasHeight: number, screenPoint: IPoint): IPoint {
    const relativePosition: IPoint = {
      x: screenPoint.x/canvasWidth * this.width,
      y: screenPoint.y/canvasHeight * this.height
    };
    return this.relativeToAbsolutePosition(relativePosition);
  }

  relativeToAbsolutePosition(relativePosition: IPoint): IPoint {
    return {
      x: relativePosition.x + this.absolutePosition.x,
      y: relativePosition.y + this.absolutePosition.y
    };
  }

  setFrameReference(player: IPlayer): void {
    const x: number = player.hero.model.origin.x - this.width / 2;
    const y: number = player.hero.model.origin.y - this.height / 2;

    // clamp values
    this.absolutePosition = {
      x: Math.max(0, Math.min(x, this.maxX)),
      y: Math.max(0, Math.min(y, this.maxY))
    };
  }
}
