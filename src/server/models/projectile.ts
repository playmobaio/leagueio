import { Point, Velocity, Vector } from './basicTypes';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces';
import constants from '../constants';

class Projectile implements IProjectile {
  position: Point;
  velocity: Velocity;
  id: string;
  range: number;
  origin: Point;

  constructor(src: Point, velocity: Velocity) {
    this.id = uuidv4();
    this.range = constants.DEFAULT_PROJECTILE_RANGE;
    this.position = src;
    this.origin = src;
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
  }

  toInterface(): IProjectile {
    return { id: this.id, position: this.position };
  }
}

export default Projectile;
