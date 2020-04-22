import { Point, Velocity, Vector, Circle } from './basicTypes';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces';
import constants from '../constants';

class Projectile implements IProjectile {
  position: Point;
  velocity: Velocity;
  id: string;
  range: number;
  origin: Point;
  model: Circle;
  shooterSourceId: string;

  constructor(shooterSourceId: string, src: Point, velocity: Velocity) {
    this.id = uuidv4();
    this.shooterSourceId = shooterSourceId;
    this.range = constants.DEFAULT_PROJECTILE_RANGE;
    this.position = src;
    this.origin = src;
    this.model = new Circle(src, constants.DEFAULT_CIRCLE_RADIUS);
    this.velocity = velocity;
  }

  shouldDelete(): boolean {
    return !this.validPosition() || this.rangeExpired();
  }

  validPosition(): boolean {
    return this.position.x > 0 && this.position.x <= constants.DEFAULT_MAP_SIZE
      && this.position.y > 0 && this.position.y <= constants.DEFAULT_MAP_SIZE;
  }

  rangeExpired(): boolean {
    const vector = Vector.createFromPoints(this.origin, this.position);
    return vector.getMagnitude() > this.range;
  }

  update(): void {
    this.position = this.position.transform(this.velocity);
    this.model.point = this.position;
  }

  toInterface(): IProjectile {
    return { id: this.id, position: this.position };
  }
}

export default Projectile;
