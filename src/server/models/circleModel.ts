import { Circle } from 'detect-collisions';
import Model from './model';
import { Point } from './basicTypes';
import { ICircleModel, IShape } from '../../models/interfaces/iModel';

const BASE_RADIUS = 1;

export default class CircleModel extends Model {
  body = null;
  private radius: number;

  constructor(position: Point, radius: number) {
    super();
    this.position = position;
    this.body = new Circle(position.x, position.y, BASE_RADIUS);
    this.updateRadius(radius);
  }

  getRadius(): number {
    return this.radius;
  }

  updateRadius(radius: number): void {
    this.radius = radius;
    // scale the body circle radius to match
    this.body.scale = radius;
  }

  // default value of 0, angles on circles are irrelevant
  getAngle(): number {
    return 0;
  }

  toIModel(): ICircleModel {
    return {
      type: IShape.Circle,
      position: this.position,
      radius: this.getRadius(),
    };
  }

  getMapCollisionPositions(point = this.position): Point[] {
    const left = point.x - this.radius;
    const right = point.x + this.radius;
    const top = point.y - this.radius;
    const bottom = point.y + this.radius;

    const points: Point[] = [];
    points.push(new Point(left, point.y));
    points.push(new Point(right, point.y));
    points.push(new Point(point.x, top));
    points.push(new Point(point.x, bottom));
    return points;
  }
}
