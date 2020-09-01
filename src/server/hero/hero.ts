import { Velocity, Vector, Point } from "../models/basicTypes";
import { IHealth, IHero } from '../../models/interfaces/iGameState';
import CircleModel from '../models/circleModel';
import HeroState from './heroState';
import Condition from './condition';
import Ability from './ability';
import Player from '../player';
import constants from '../constants';
import { getFramesBetweenAutoAttack } from '../tools/frame';

abstract class Hero {
  attackSpeed: number;
  health: IHealth;
  model: CircleModel;
  abstract qAbility: Ability;
  abstract wAbility: Ability;
  abstract eAbility: Ability;
  state: HeroState;
  level: number;
  lastAutoAttackFrame: number;
  experience: number;
  movementSpeed: number;
  movementDestination: Point;
  player: Player;
  autoAttack: Ability;
  spawnLocation = new Point(constants.DEFAULT_SPAWN_LOCATION_X, constants.DEFAULT_SPAWN_LOCATION_Y);

  constructor(player: Player) {
    this.movementSpeed = constants.DEFAULT_PLAYER_MOVEMENT_SPEED;
    this.attackSpeed = constants.DEFAULT_PLAYER_ATTACK_SPEED;
    this.lastAutoAttackFrame = -1;
    this.player = player;
    this.state = new HeroState();
    this.state = new HeroState(this);
    this.model = new CircleModel(this.player.game,
      this.spawnLocation,
      constants.DEFAULT_CIRCLE_RADIUS);
  }

  stopHero(): void {
    this.model.setVelocity(Velocity.createNull());
    console.log("Hero stopped");
  }

  updateVelocity(point: Point): void {
    this.movementDestination = point;
    this.model.setVelocity(new Velocity(point, this.movementSpeed, this.model.getPosition()));
    this.state.clearQueueCast();
  }

  // Since positions are not exact, the hero has reached their destination if
  // they will overshoot the destination in the next frame. Default to true if
  // hero is not moving.
  reachedDestination(): boolean {
    const vector = Vector.createFromPoints(this.model.getPosition(), this.movementDestination);
    return this.movementSpeed > vector.getMagnitude();
  }

  performAttack(dest: Point): void {
    switch (this.state.condition) {
    case Condition.Active:
      this.performAutoAttack(dest);
      return;
    }
  }

  performAutoAttack(dest: Point): void {
    if (dest == undefined || this.model.getPosition().equals(dest) || !this.canAutoAttack()) {
      return;
    }
    this.onAutoAttack(dest);
    this.lastAutoAttackFrame = this.player.game.currentFrame;
  }

  abstract onAutoAttack(dest: Point): void;

  respawn(): void {
    this.model = new CircleModel(this.player.game,
      this.spawnLocation,
      constants.DEFAULT_CIRCLE_RADIUS);
  }

  canAutoAttack(): boolean {
    if (this.lastAutoAttackFrame == -1) {
      return true;
    }
    const framesBetweenAutoAttacks = getFramesBetweenAutoAttack(this.attackSpeed);
    return this.lastAutoAttackFrame + framesBetweenAutoAttacks <= this.player.game.currentFrame;
  }

  shouldStopHero(): boolean {
    // stop hero if the hero has reached its destination
    if (this.reachedDestination()) {
      console.log("Hero reached destination.");
      return true;
    }

    const transformPoint = this.model.getTransformPosition();
    // stop hero if the hero is attempting to move off the map
    if (!this.model.isOnMap(transformPoint)) {
      console.log("Hero is attempting to move off map.");
      return true;
    }

    // stop hero if the hero is attempting to move into a solid tile
    if (this.model.collidesWithSolidTile(transformPoint)) {
      console.log("Hero is attempting to move into a solid tile.");
      return true;
    }

    return false;
  }

  transform(): void {
    if (this.model.getVelocity().speed !== 0 && this.shouldStopHero()) {
      this.stopHero();
    }
    this.model.transform();
  }

  toInterface(): IHero {
    return {
      model: this.model.toIModel(),
    }
  }

  update(): void {
    this.state.update();
    if (this.state.canMove()) {
      this.transform();
    }
  }
}
export default Hero;
