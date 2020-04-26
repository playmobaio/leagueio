import { IPlayer, PlayerMovementIO, IPoint, IHealth } from '../../models/interfaces';
import { Point, Velocity, Circle } from './basicTypes';
import Game from "./game";
import constants from '../constants';

class Player implements IPlayer {
  id: string;
  position: Point;
  velocity: Velocity;
  socket: SocketIO.Socket;
  game: Game;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;
  model: Circle;

  constructor(id: string, point: Point, socket: SocketIO.Socket) {
    this.id = id;
    this.position = point;
    this.velocity = new Velocity(this.position, 0);
    this.socket = socket;
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.game = Game.getInstance();
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
    this.model = new Circle(point, constants.DEFAULT_CIRCLE_RADIUS);
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
    this.position = point;
    this.model.center = point;
  }

  updateVelocity(io: PlayerMovementIO): void {
    this.velocity = Velocity.getPlayerVelocity(io);
  }

  updateHealth(newCurrentHealth: number, newMaxHealth: number): void {
    if(newCurrentHealth < 0) {
      newCurrentHealth = 0;
    }
    this.health = { current: newCurrentHealth, maximum: newMaxHealth };
  }

  respawn(): void {
    const newPoint: Point = this.game.gamemap.randomMapPosition();
    this.updatePosition(newPoint);
    this.updateHealth(constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      constants.DEFAULT_PLAYER_MAXIMUM_HEALTH);
  }

  update(): void {
    this.updatePosition(this.position.transform(this.velocity));
  }

  toInterface(): IPlayer {
    return { id: this.id, position: this.position, health: this.health };
  }
}

export default Player;
