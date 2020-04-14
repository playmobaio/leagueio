import { Point, Velocity } from './basicTypes';
import { v4 as uuidv4 } from 'uuid';
import { IProjectile } from '../../models/interfaces';
import constants from '../constants';

class Projectile {
  position: Point;
  velocity: Velocity;
  id: string;

  constructor(src: Point, velocity: Velocity) {
    this.id = uuidv4();
    this.position = src;
    this.velocity = velocity;
  }

  validPosition(): boolean {
    return this.position.x > 0 && this.position.x <= constants.DEFAULT_MAP_SIZE
      && this.position.y > 0 && this.position.y <= constants.DEFAULT_MAP_SIZE;
  }

  update(io: SocketIO.Server): void {
    const projectile: IProjectile = { id: this.id, position: this.position }
    io.emit("S:PROJECTILE_MOVE", projectile);
    this.position = this.position.transform(this.velocity);
  }
}

export default Projectile;