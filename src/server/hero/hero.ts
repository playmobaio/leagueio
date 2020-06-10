import { Velocity, Circle, Vector, Point } from "../models/basicTypes";
import { IHealth, IPoint } from '../../models/interfaces';
import HeroState from './heroState';
import Ability from './ability';
import Player from '../models/player';
import Game from '../models/game';
import constants from '../constants';

class Hero {
  movementSpeed: Velocity;
  attackSpeed: number;
  health: IHealth;
  model: Circle;
  qAbility: Ability;
  wAbility: Ability;
  eAbility: Ability;
  state: HeroState;
  level: number;
  lastAutoAttackFrame: number;
  experience: number;
  velocity: Velocity;
  velocityMagnitude: number;
  velocitySource: Point;
  range: number;
  player: Player;

  constructor(player: Player) {
    this.velocityMagnitude = constants.DEFAULT_PLAYER_VELOCITY
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.player = player;
    this.state = new HeroState();
  }

  updateVelocity(point: IPoint): void {
    this.velocitySource = this.model.center;
    this.range = Vector.createFromPoints(this.velocitySource, point).getMagnitude();
    this.velocity = new Velocity(point, this.velocityMagnitude, this.model.center);
  }

  rangeExpired(): boolean {
    if (!this.velocitySource || !this.model?.center) {
      return true;
    }
    const vector = Vector.createFromPoints(this.velocitySource, this.model.center);
    return vector.getMagnitude() > this.range;
  }

  performAutoAttack(dest: IPoint, onAutoAttack?: Function): void {
    if (dest == undefined || this.model.center.equals(dest) || !this.canAutoAttack()) {
      return;
    }
    if (onAutoAttack) {
      onAutoAttack();
    }
    this.lastAutoAttackFrame = Game.getInstance().currentFrame;
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }
    const framesBetweenAutoAttacks = constants.FRAMES_PER_SECOND / this.attackSpeed;
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= Game.getInstance().currentFrame;
  }

  updatePosition(point: Point): void {
    if (!Game.getInstance().gameMap.isOnMap(point) ||
      this.model.isInvalidPosition(Game.getInstance().gameMap, point)) {
      return;
    }
    this.model.center = point;
  }

  update(): void {
    if (!this.rangeExpired()) {
      this.updatePosition(this.model.center.transform(this.velocity));
    }
    this.state.update();
  }
}
export default Hero;