import { IPoint, ICircle, Shape } from '../../models/interfaces';
import GameMap from './gameMap';
import Game from './game';

export class Vector {
  readonly x: number;
  readonly y: number;

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

export class VectorBuilder {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static createFromVector(vector: Vector): VectorBuilder {
    return new VectorBuilder(vector.x, vector.y);
  }

  static createFromPoints(src: IPoint, dest: IPoint): VectorBuilder {
    const x: number = dest.x - src.x;
    const y: number = dest.y - src.y;
    return new VectorBuilder(x, y);
  }

  private getMagnitude(): number {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  setMagnitude(newMagnitude: number): VectorBuilder {
    if (newMagnitude == 0) {
      this.x = 0;
      this.y = 0;
      return this;
    }

    const originalMagnitude = this.getMagnitude();
    this.x *= newMagnitude/originalMagnitude;
    this.y *= newMagnitude/originalMagnitude;
    return this;
  }

  rotateCounterClockWise(radians: number): VectorBuilder {
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const translatedX = this.x * cosine - this.y * sine;
    const translatedY = this.x * sine + this.y * cosine;
    this.x = translatedX;
    this.y = translatedY;
    return this;
  }

  build(): Vector {
    return new Vector(this.x, this.y);
  }
}

export class Point implements IPoint {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static createFromIPoint(iPoint: IPoint): Point {
    return new Point(iPoint.x, iPoint.y);
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

  distanceFrom(otherPoint: Point): number {
    return Vector.createFromPoints(this, otherPoint).getMagnitude();
  }
}

export class Circle implements ICircle {
  origin: Point;
  radius: number;
  type = Shape.Circle;

  constructor(radius: number, position?: Point) {
    this.origin = position == null ? this.getRandomValidPosition(radius) : position;
    this.radius = radius;
  }

  getRandomValidPosition(radius: number): Point {
    const game: Game = Game.getInstance();
    const position: Point = game.gameMap.randomMapPosition();
    if (this.isInvalidPosition(game.gameMap, position, radius * 2)) {
      return this.getRandomValidPosition(radius);
    }
    return position;
  }

  isInvalidPosition(map: GameMap, point = this.origin, radius = this.radius): boolean {
    const left = point.x - radius;
    const right = point.x + radius;
    const top = point.y - radius;
    const bottom = point.y + radius;

    return map.isSolidTile(left, top) ||
      map.isSolidTile(right, top) ||
      map.isSolidTile(right, bottom) ||
      map.isSolidTile(left, bottom) ||
      map.isSolidTile(point.x, point.y);
  }

  collidesWithCircle(otherCircle: Circle): boolean {
    const otherCircleCenter = otherCircle.origin;
    const otherCircleRadius = otherCircle.radius;
    const distanceFromCenter = this.origin.distanceFrom(otherCircleCenter);

    return distanceFromCenter < this.radius + otherCircleRadius;
  }
}

export class Velocity {
  readonly unitVector: Vector;
  readonly speed: number;

  constructor(dest: IPoint, speed: number, src: IPoint = { x: 0, y: 0 }) {
    if (speed < 0) {
      throw new Error("Speed cannot be negative");
    }

    this.unitVector = Vector.createFromPoints(src, dest).getUnitVector();
    this.speed = this.unitVector.getMagnitude() == 0 ? 0 : speed;
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

