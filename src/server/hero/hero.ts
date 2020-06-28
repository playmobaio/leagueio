import { Velocity, Circle, Vector, Point } from "../models/basicTypes";
import { IHealth, IPoint, IHero, Condition } from '../../models/interfaces';
import HeroState from './heroState';
import Ability from './ability';
import Player from '../models/player';
import Game from '../models/game';
import constants from '../constants';

abstract class Hero {
  movementSpeed: Velocity;
  attackSpeed: number;
  health: IHealth;
  model: Circle;
  abstract qAbility: Ability;
  abstract wAbility: Ability;
  abstract eAbility: Ability;
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
    this.velocitySource = this.model.origin;
    this.range = Vector.createFromPoints(this.velocitySource, point).getMagnitude();
    this.velocity = new Velocity(point, this.velocityMagnitude, this.model.origin);
  }

  rangeExpired(): boolean {
    if (!this.velocitySource || !this.model?.origin) {
      return true;
    }
    const vector = Vector.createFromPoints(this.velocitySource, this.model.origin);
    return vector.getMagnitude() > this.range;
  }

  performAttack(dest: IPoint): void {
    switch (this.state.condition) {
    case Condition.Active:
      this.performAutoAttack(dest);
      return;
    }
  }

  performAutoAttack(dest: IPoint): void {
    if (dest == undefined || this.model.origin.equals(dest) || !this.canAutoAttack()) {
      return;
    }
    this.onAutoAttack(dest);
    this.lastAutoAttackFrame = Game.getInstance().currentFrame;
  }

  abstract onAutoAttack(dest: IPoint): void;

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
    this.model.origin = point;
  }

  toInterface(): IHero {
    return {
      model: this.model
    }
  }

  update(): void {
    if (!this.rangeExpired()) {
      this.updatePosition(this.model.origin.transform(this.velocity));
    }
    this.state.update();
  }
}
export default Hero;