import { IPoint, PlayerMovementIO } from '../../models/interfaces';
import constants from '../constants';

export class Vector {
  x: number
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static createFromPoints(src: IPoint, dest: IPoint): Vector {
    const x = dest.x - src.x;
    const y = dest.y - src.y;
    return new Vector(x, y);
  }

  getMagnitude(): number {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  setMagnitude(newMagnitude: number): void {
    if (newMagnitude == 0) {
      this.x = 0;
      this.y = 0;
      return;
    }

    const originalMagnitude = this.getMagnitude();
    this.x *= newMagnitude/originalMagnitude;
    this.y *= newMagnitude/originalMagnitude;
  }

  getUnitVector(): Vector {
    const magnitude = this.getMagnitude();

    // Unit vector of the null vector is the null vector
    if (magnitude == 0) {
      return Vector.createNullVector();
    }

    return new Vector(this.x/magnitude, this.y/magnitude);
  }

  isNullVector(): boolean {
    return this.x == 0 && this.y == 0;
  }

  static createNullVector(): Vector {
    return new Vector(0, 0);
  }
}

export class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  transform(velocity: Velocity): Point {
    const vector: Vector = velocity.getVector();
    return this.transformWithVector(vector);
  }

  transformWithVector(vector: Vector): Point {
    return new Point(this.x + vector.x, this.y + vector.y);
  }

  equals(point: IPoint): boolean {
    return this.x == point.x && this.y == point.y
  }

  distanceFrom(otherPoint: Point) : number {
    return Vector.createFromPoints(this,otherPoint).getMagnitude();
  }
}

export class Circle {
  center: Point;
  radius: number;

  constructor(point: Point, radius: number) {
    this.center = point;
    this.radius = radius;
  }

  collidesWithCircle(otherCircle: Circle) : boolean {
    const otherCircleCenter = otherCircle.center;
    const otherCircleRadius = otherCircle.radius;
    const distanceFromCenter = this.center.distanceFrom(otherCircleCenter);

    return distanceFromCenter < this.radius + otherCircleRadius;
  }
}

export class Velocity {
  private unitVector: Vector;
  private speed: number;

  constructor(dest: IPoint, speed: number, src: IPoint = { x: 0, y: 0 }) {
    if (speed < 0) {
      throw new Error("Speed cannot be negative");
    }

    this.unitVector = Vector.createFromPoints(src, dest).getUnitVector();
    this.speed = this.unitVector.getMagnitude() == 0 ? 0 : speed;
  }

  static getPlayerVelocity(io: PlayerMovementIO): Velocity {
    let x = 0
    let y = 0;
    if (io & PlayerMovementIO.up)
      y-= 1;
    if (io & PlayerMovementIO.left)
      x-= 1;
    if (io & PlayerMovementIO.down)
      y+= 1;
    if (io & PlayerMovementIO.right)
      x+= 1;
    return new Velocity(new Point(x, y), constants.DEFAULT_PLAYER_VELOCITY);
  }

  getSpeed(): number {
    return this.speed;
  }

  setSpeed(speed: number): boolean {
    if (this.unitVector.isNullVector()) {
      return false;
    }
    this.speed = speed;
    return true;
  }

  getUnitVector(): Vector {
    return this.unitVector;
  }

  getVector(): Vector {
    const x: number = this.speed * this.unitVector.x;
    const y: number = this.speed * this.unitVector.y;
    return new Vector(x, y);
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

