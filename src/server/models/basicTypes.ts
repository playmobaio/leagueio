import { IPoint } from '../../models/interfaces/basicTypes';

export class Vector {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static createFromPoints(src: Point, dest: Point): Vector {
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

  getAngleInRadians(): number {
    return Math.atan2(this.y, this.x);
  }

  static createNullVector(): Vector {
    return new Vector(0, 0);
  }

  toString(): string {
    return "Vector(" + this.x + ", " + this.y + ")";
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

  static createFromPoints(src: Point, dest: Point): VectorBuilder {
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

  equals(point: Point): boolean {
    return this.x == point.x && this.y == point.y
  }

  distanceFrom(otherPoint: Point): number {
    return Vector.createFromPoints(this, otherPoint).getMagnitude();
  }

  toString(): string {
    return "(" + this.x + ", " + this.y + ")";
  }
}

export class Velocity {
  readonly unitVector: Vector;
  readonly speed: number;

  constructor(dest: Point, speed: number, src: Point = new Point(0, 0)) {
    if (speed < 0) {
      throw new Error("Speed cannot be negative");
    }

    this.unitVector = Vector.createFromPoints(src, dest).getUnitVector();
    this.speed = this.unitVector.getMagnitude() == 0 ? 0 : speed;
  }

  static createNull(): Velocity {
    return new Velocity(new Point(0, 0), 0);
  }

  getVector(): Vector {
    const x: number = this.speed * this.unitVector.x;
    const y: number = this.speed * this.unitVector.y;
    return new Vector(x, y);
  }
}
