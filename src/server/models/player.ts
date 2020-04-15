import { IPlayer, UserIO, IPoint } from '../../models/interfaces';
import { Point, Velocity } from './basicTypes';
import Projectile from './projectile';
import constants from '../constants';

class Player implements IPlayer{
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;
  projectiles: Map<string, Projectile>;

  constructor(id: string, point: Point, socket: SocketIO.Socket) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(this.position, 0);
    this.socket = socket;
    this.projectiles = new Map<string, Projectile>();
  }

  addProjectile(dest: IPoint): Projectile {
    if (dest == undefined) return null;
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_TO_USER_OFFSET,
      this.position);
    const origin: Point = this.position.transform(velocity);
    velocity.speed = constants.DEFAULT_PROJECTILE_SPEED;
    const projectile = new Projectile(origin, velocity)
    this.projectiles.set(projectile.id, projectile);
    return projectile;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }

  updateVelocity(io: UserIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  update(io: SocketIO.Server): void {
    const retPlayer: IPlayer = { id: this.id, position: this.position };
    io.emit("S:PLAYER_MOVE", retPlayer);
    this.updatePosition(this.position.transform(this.velocity));
  }
}

export default Player;
