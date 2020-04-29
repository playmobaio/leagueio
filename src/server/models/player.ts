import { IPlayer, PlayerMovementIO, IPoint, IHealth } from '../../models/interfaces';
import { Point, Velocity, Circle } from './basicTypes';
import Game from "./game";
import constants from '../constants';

class Player implements IPlayer {
  id: string;
  velocity: Velocity;
  socket: SocketIO.Socket;
  game: Game;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;
  model: Circle;

  constructor(id: string, point: Point, socket: SocketIO.Socket) {
    this.id = id;
    this.model = new Circle(point, constants.DEFAULT_CIRCLE_RADIUS);
    this.velocity = new Velocity(this.model.center, 0);
    this.socket = socket;
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
    this.game.addProjectile(this.id, dest);
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }

    const framesBetweenAutoAttacks = constants.FRAMES_PER_SECOND * this.attackSpeed;
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= this.game.currentFrame;
  }

  updatePosition(point: Point): void {
    this.model.center = point;
  }

  updateVelocity(io: PlayerMovementIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  respawnUpdateHealth(): void {
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
  }

  receiveDamage(incomingDamage: number): void {
    this.health = { current: this.health.current - incomingDamage, maximum: this.health.maximum };
  }

  respawn(): void {
    const newPoint: Point = this.game.gamemap.randomMapPosition();
    this.updatePosition(newPoint);
    this.respawnUpdateHealth();
  }

  update(): void {
    this.updatePosition(this.model.center.transform(this.velocity));
  }

  toInterface(): IPlayer {
    return { id: this.id, model: this.model, health: this.health };
  }
}

export default Player;
