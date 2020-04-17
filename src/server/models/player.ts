import { IPlayer, PlayerMovementIO, IPoint, IHealth } from '../../models/interfaces';
import { Point, Velocity, Vector } from './basicTypes';
import Projectile from './projectile';
import Game from "./game";
import constants from '../constants';

class Player implements IPlayer {
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;
  projectiles: Map<string, Projectile>;
  game: Game;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;

  constructor(id: string, point: Point, socket: SocketIO.Socket) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(this.position, 0);
    this.socket = socket;
    this.projectiles = new Map<string, Projectile>();
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.game = Game.getInstance();
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
  }

  registerAutoAttack(dest: IPoint): void {
    if (!this.canAutoAttack()) {
      return;
    }
    this.lastAutoAttackFrame = this.game.currentFrame;
    this.addProjectile(dest);
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }

    const framesBetweenAutoAttacks = constants.FRAMES_PER_SECOND * this.attackSpeed;
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= this.game.currentFrame;
  }

  addProjectile(dest: IPoint): Projectile {
    if (dest == undefined || this.position.equals(dest)) {
      return null;
    }

    const offsetVector = Vector.createFromPoints(this.position, dest);
    offsetVector.setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = this.position.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      this.position);
    const projectile = new Projectile(origin, velocity)

    this.projectiles.set(projectile.id, projectile);
    return projectile;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }

  updateVelocity(io: PlayerMovementIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  update(): void {
    this.updatePosition(this.position.transform(this.velocity));
  }

  toInterface(): IPlayer {
    return { id: this.id, position: this.position, health: this.health };
  }
}

export default Player;
