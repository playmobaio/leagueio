import { IPlayer,
  PlayerMovementIO,
  IPoint,
  IHealth,
  IGameState,
  IProjectile } from '../../models/interfaces';
import { Point, Velocity, Circle, Vector } from './basicTypes';
import Game from "./game";
import Projectile from "./projectile";
import constants from '../constants';
import { EmitEvent } from '../tools/emitEvent'

class Player implements IPlayer {
  id: string;
  velocity: Velocity;
  socket: SocketIO.Socket;
  game: Game;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;
  model: Circle;

  private constructor(id: string, point: Point, socket: SocketIO.Socket) {
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

  static create(id: string, point: Point, socket: SocketIO.Socket): Player {
    const player = new Player(id, point, socket);
    player.game.emitter.emit(EmitEvent.NewPlayer, player);
    return player;
  }

  registerAutoAttack(dest: IPoint): void {
    if (dest == undefined || this.model.center.equals(dest) || !this.canAutoAttack()) {
      return;
    }

    const offsetVector = Vector.createFromPoints(this.model.center, dest);
    offsetVector.setMagnitude(constants.DEFAULT_PROJECTILE_TO_USER_OFFSET);
    const origin: Point = this.model.center.transformWithVector(offsetVector);
    const velocity = new Velocity(dest,
      constants.DEFAULT_PROJECTILE_SPEED,
      this.model.center);

    Projectile.create(this, origin, velocity);
    this.lastAutoAttackFrame = this.game.currentFrame;
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

  receiveDamage(incomingDamage: number): void {
    this.health.current = Math.max(0, this.health.current - incomingDamage);
  }

  respawn(): void {
    const newPoint: Point = this.game.gameMap.randomValidMapPosition();
    this.updatePosition(newPoint);
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
  }

  update(): void {
    this.updatePosition(this.model.center.transform(this.velocity));
  }

  toInterface(): IPlayer {
    return { id: this.id, model: this.model.toInterface(), health: this.health };
  }

  getGameState(players: Array<IPlayer>, projectiles: Array<IProjectile>): IGameState {
    return {
      client: this.toInterface(),
      players: players,
      projectiles: projectiles,
      currentFrame: this.game.currentFrame
    };
  }
}

export default Player;
