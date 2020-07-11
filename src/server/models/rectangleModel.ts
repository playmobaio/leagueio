import { Polygon } from 'detect-collisions';
import { Point } from './basicTypes';
import { IPoint } from '../../models/interfaces';
import Model from './model';

export default class RectangleModel extends Model {
  body = null;
  // point marks the top left corner of the rectangle when angle = 0
  private width: number;
  private height: number;
  // Angle is measured in 0 - 2* pi radians, with 0 being the neutral state where
  // the 4 vertices of the rectangle are:
  // [(x, y), (x + width, y), (x + width, y - height), (x, y - height)]
  // in clockwise order. An angle of Math.PI/2 would rotate the rectangle 90 degrees
  // clockwise, so that new verticies would be:
  // [(x, y), (x, y - width), (x - height, y - width), (x - height, y)]
  private angle: number;

  constructor(position: IPoint, width: number, height: number, angle = 0) {
    super();
    this.position = new Point(position.x, position.y);
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.body = new Polygon(position.x, position.y, [[0, 0], [1, 0], [1, 1], [0, 1]]);
    this.updatePoints();
    this.addBody();
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getAngle(): number {
    return this.angle;
  }

  updateWidth(width: number): void {
    this.width = width;
    this.updatePoints();
  }

  updateHeight(height: number): void {
    this.height = height;
    this.updatePoints();
  }

  // Updates the collision body points for the model. Should be called every time
  // there is a change to the height and width of the RectangleModel is updated.
  // Using scale_x and scale_y to update points is the simplest method that most aligns with
  // detect-collisions API.
  private updatePoints(): void {
    this.body['scale_x'] = this.width;
    this.body['scale_y'] = this.height;
  }

  updateAngle(angle: number): void {
    this.angle = angle;
    this.body.angle = angle;
  }
}
