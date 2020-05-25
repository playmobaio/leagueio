import { IPlayer,
  IPoint,
  IHealth,
  IGameState,
  IProjectile } from '../../models/interfaces';
import { Point, Velocity, Circle, Vector } from './basicTypes';
import Game from "./game";
import Projectile from "./projectile";
import constants from '../constants';
import { EmitEvent } from '../tools/emitEvent'
import Hero from '../champion/hero';

class Player implements IPlayer {
  id: string;
  username: string;
  displayName: string;
  team: string;
  hero: Hero;
  velocity: Velocity;
  socket: SocketIO.Socket;
  attackSpeed: number;
  lastAutoAttackFrame: number;
  health: IHealth;
  model: Circle;
  src: Point;
  range: number;

  private constructor(id: string, socket: SocketIO.Socket) {
    this.id = id;
    this.model = new Circle(constants.DEFAULT_CIRCLE_RADIUS);
    this.velocity = new Velocity(this.model.center, 0);
    this.socket = socket;
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.range = 0;
    this.src = this.model.center;
    this.health = {
      current: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH,
      maximum: constants.DEFAULT_PLAYER_MAXIMUM_HEALTH };
  }

  static create(id: string, socket: SocketIO.Socket): Player {
    const player = new Player(id, socket);
    Game.getInstance().emitter.emit(EmitEvent.NewPlayer, player);
    return player;
  }

  registerAutoAttack(dest: IPoint): void {
    if (dest == undefined || this.model.center.equals(dest) || !this.canAutoAttack()) {
      return;
    }
    Projectile.create(this, this.model, dest);
    this.lastAutoAttackFrame = Game.getInstance().currentFrame;
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }

    const framesBetweenAutoAttacks = constants.FRAMES_PER_SECOND * this.attackSpeed;
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= Game.getInstance().currentFrame;
  }

  updatePosition(point: Point): void {
    if (!Game.getInstance().gameMap.isOnMap(point) ||
      this.model.isInvalidPosition(Game.getInstance().gameMap, point)) {
      return;
    }
    this.model.center = point;
  }

  updateVelocity(point: IPoint): void {
    this.src = this.model.center;
    this.range = Vector.createFromPoints(this.src, point).getMagnitude();
    this.velocity = new Velocity(point, constants.DEFAULT_PLAYER_VELOCITY, this.model.center);
  }

  receiveDamage(incomingDamage: number): void {
    this.health.current = Math.max(0, this.health.current - incomingDamage);
  }

  respawn(): void {
    this.model = new Circle(this.model.radius);
    this.health.current = constants.DEFAULT_PLAYER_MAXIMUM_HEALTH;
  }

  update(): void {
    if (this.rangeExpired()) {
      return;
    }
    this.updatePosition(this.model.center.transform(this.velocity));
  }

  rangeExpired(): boolean {
    const vector = Vector.createFromPoints(this.src, this.model.center);
    return vector.getMagnitude() > this.range;
  }

  toInterface(): IPlayer {
    return { id: this.id, model: this.model.toInterface(), health: this.health };
  }

  getGameState(players: Array<IPlayer>, projectiles: Array<IProjectile>): IGameState {
    return {
      client: this.toInterface(),
      players: players,
      projectiles: projectiles,
      currentFrame: Game.getInstance().currentFrame
    };
  }
}

export default Player;
