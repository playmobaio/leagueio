import { Polygon } from 'detect-collisions';
import { Point } from './basicTypes';
import Model from './model';
import Game from '../game';
import { IRectangleModel, IShape } from '../../models/interfaces/iModel';

const BASE_RECTANGLE_COORDINATES: number[][] = [[0, 0], [1, 0], [1, 1], [0, 1]];

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

  constructor(game: Game, position: Point, width: number, height: number, angle = 0) {
    super(game);
    this.position = position;
    this.width = width;
    this.height = height;
    this.body = new Polygon(position.x, position.y, BASE_RECTANGLE_COORDINATES);
    this.updateAngle(angle);
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

  toIModel(): IRectangleModel {
    return {
      type: IShape.Rectangle,
      position: this.position,
      width: this.getWidth(),
      height: this.getHeight(),
      angle: this.getAngle()
    };
  }

  getMapCollisionPositions(point = this.position): Point[] {
    // TODO: Doesn't work with angle
    const points: Point[] = [];
    points.push(new Point(point.x, point.y));
    points.push(new Point(point.x + this.width, point.y));
    points.push(new Point(point.x, point.y + this.height));
    points.push(new Point(point.x + this.width, point.y + this.height));
    return points;
  }
}
