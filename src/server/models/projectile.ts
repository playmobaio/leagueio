import { Point, Velocity, Vector } from './basicTypes';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces';
import constants from '../constants';
import GameMap from './gameMap';

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

  shouldDelete(map: GameMap): boolean {
    return !this.validPosition(map) || this.rangeExpired();
  }

  validPosition(map: GameMap): boolean {
    return this.position.x > 0 && this.position.x <= map.width
      && this.position.y > 0 && this.position.y <= map.height;
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
