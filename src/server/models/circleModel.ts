import { Circle } from 'detect-collisions';
import Model from './model';
import { Point } from './basicTypes';
import { IPoint } from '../../models/interfaces';

const BASE_RADIUS = 1;

export default class CircleModel extends Model {
  body = null;
  private radius: number;

  constructor(position: IPoint, radius: number) {
    super();
    this.position = new Point(position.x, position.y);
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
}
