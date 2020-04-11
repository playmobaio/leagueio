import { IPoint, UserIO } from '../../models/interfaces';

export class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  transform(velocity: Velocity): Point {
    return new Point(this.x + velocity.x, this.y + velocity.y);
  }
}

export class Velocity {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static getVelocity(io: UserIO): Velocity {
    let x = 0
    let y = 0;
    if (io & UserIO.w)
      y-= 5;
    if (io & UserIO.a)
      x-= 5;
    if (io & UserIO.s)
      y+= 5;
    if (io & UserIO.d)
      x+= 5;
    return new Velocity(x, y);
  }

  getSpeed(): number {
    return Math.sqrt(this.x**2 + this.y**2);
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

