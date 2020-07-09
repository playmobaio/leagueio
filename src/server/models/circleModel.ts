import { Circle } from 'detect-collisions';
import Model from './model';
import { Point } from './basicTypes';
import { IPoint } from '../../models/interfaces';

export default class CircleModel extends Model {
  body = null;
  private radius: number;

  constructor(position: IPoint, radius: number) {
    super();
    this.position = new Point(position.x, position.y);
    this.body = new Circle(position.x, position.y, 1);
    this.updateRadius(radius);
  }

  getRadius(): number {
    return this.radius;
  }

  updateRadius(radius: number) {
    this.radius = radius;
    this.body.scale = radius;
  }
}
