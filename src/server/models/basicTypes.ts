import { IPoint, UserIO } from '../../models/interfaces';
import constants from '../constants';

export class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  transform(velocity: Velocity): Point {
    const translation: IPoint = velocity.getVector();
    return new Point(this.x + translation.x, this.y + translation.y);
  }
}

export class Velocity {
  private unitVector: IPoint;
  speed: number;

  constructor(dest: IPoint, speed: number, src: IPoint = { x: 0, y: 0 }) {
    const vector: { x: number, y: number } = Velocity.createUnitVector(src, dest);
    this.unitVector = vector;
    if (speed < 0) {
      throw new Error("Speed cannot be negative");
    }
    this.speed = speed;
  }

  static getPlayerVelocity(io: UserIO): Velocity {
    let x = 0
    let y = 0;
    if (io & UserIO.up)
      y-= 1;
    if (io & UserIO.left)
      x-= 1;
    if (io & UserIO.down)
      y+= 1;
    if (io & UserIO.right)
      x+= 1;
    return new Velocity(new Point(x, y), constants.DEFAULT_PLAYER_VELOCITY);
  }

  static createUnitVector(src: IPoint, dest: IPoint): { x: number, y: number } {
    const x = dest.x - src.x;
    const y = dest.y - src.y;
    const magnitude = Math.sqrt(x**2 + y**2);
    if (magnitude == 0) {
      return { x: 0, y: 0 }
    } else {
      return { x: x/magnitude, y: y/magnitude };
    }
  }

  getUnitVector(): IPoint {
    return this.unitVector;
  }

  getVector(): IPoint {
    return { x: this.speed * this.unitVector.x, y: this.speed * this.unitVector.y };
  }
}

export class Rectangle {
  // point marks the top left corner of the rectangle when angle = 0
  point: Point;
  width: number;
  height: number;
  // Angle is measured in 0 - 360 degrees, with 0 being the neutral state where
  // the 4 vertices of the rectangle are:
  // [(x, y), (x + width, y), (x + width, y - height), (x, y - height)]
  // in clockwise order. An angle of 90 would rotate the rectangle 90 degrees
  // clockwise, so that new verticies would be:
  // [(x, y), (x, y - width), (x - height, y - width), (x - height, y)]
  angle: number;

  constructor(point: Point, width: number, height: number, angle = 0) {
    this.point = point;
    this.width = width;
    this.height = height;
    this.angle = angle;
  }

  isCollision(rectangle: Rectangle): boolean {
    if (this.angle != 0 || rectangle.angle != 0) {
      throw 'Unimplemented';
    }

    return this.point.x <= rectangle.point.x + rectangle.width
      && rectangle.point.x <= this.point.x + this.width
      && this.point.y <= rectangle.point.y + rectangle.height
      && rectangle.point.y <= this.point.y + this.height;
  }

  transform(velocity: Velocity): Rectangle {
    return new Rectangle(
      this.point.transform(velocity),
      this.width,
      this.height,
      this.angle
    );
  }
}

// TODO Circle
// integrate circle collisions with rectangles

