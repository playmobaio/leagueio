import { IPoint } from '../../models/interfaces';
import Gamemap from './gamemap';
import Player from './player';

export default class Camera {
  position : IPoint;
  width : number;
  height: number;
  maxX: number;
  maxY: number;
  screen: IPoint;

  constructor(map: Gamemap, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tileSize - width;
    this.maxY = map.rows * map.tileSize - height;
    this.position = { x: 0, y: 0 };
    this.screen = { x: 0, y: 0 };
  }

  getRelativePosition(absolutePosition: IPoint): IPoint {
    return {
      x: absolutePosition.x - this.position.x,
      y: absolutePosition.y - this.position.y
    };
  }

  getAbsolutePosition(relativePosition: IPoint): IPoint {
    return {
      x: relativePosition.x + this.position.x,
      y: relativePosition.y + this.position.y
    };
  }

  update(player: Player): void {
    const userPosition: IPoint = player.position;
    if (userPosition == null) {
      return;
    }
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.screen.x = this.width / 2;
    this.screen.y = this.height / 2

    // make the camera follow the sprite
    this.position = { x: userPosition.x - this.width / 2,  y: userPosition.y - this.height / 2 };
    let x: number = userPosition.x - this.width / 2;
    let y: number = userPosition.y - this.height / 2;

    // clamp values
    x = Math.max(0, Math.min(x, this.maxX));
    y = Math.max(0, Math.min(y, this.maxY));

    this.position = { x: x, y: y };
    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (userPosition.x < this.width / 2 ||
        userPosition.x > this.maxX + this.width / 2) {
      this.screen.x = userPosition.x - this.position.x;
    }
    // top and bottom sides
    if (userPosition.y < this.height / 2 ||
        userPosition.y > this.maxY + this.height / 2) {
      this.screen.y = userPosition.y - this.position.y;
    }
  }
}