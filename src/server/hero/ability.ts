import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames } from '../tools/frame';
import constants from '../constants';
import { IShape, IPoint, ICasting, IAbility, CastRestriction } from '../../models/interfaces';
import { Abilities } from '../../models/data/heroAbilities';
import { Vector, Point } from '../models/basicTypes';

abstract class Ability {
  cooldown: number;
  castTime: number;
  nextAvailableCastFrame: number;
  range: number;
  hero: Hero;
  area: IShape;
  targetPosition: IPoint;
  abstract castRestriction: CastRestriction;
  abstract name: string;

  constructor(hero: Hero) {
    this.hero = hero;
    this.nextAvailableCastFrame = 0;
    this.castTime = constants.DEFAULT_CAST_LENGTH;
  }

  abstract onCast(): void;

  cast(): void {
    const currFrame = Game.getInstance().currentFrame;
    if (this.nextAvailableCastFrame > currFrame) {
      return;
    }
    if (!this.isInRange()) {
      this.hero.updateVelocity(new Point(this.targetPosition.x, this.targetPosition.y));
      this.hero.state.queueCast(this);
      return;
    }
    if (this.hero.state.isQueuedCast(this)) {
      this.hero.stopHero();
    }
    this.hero.state.addCasting(this);
    this.hero.state.clearQueueCast();
    this.nextAvailableCastFrame = currFrame + secondsToFrames(this.cooldown);
    const casting: ICasting = {
      coolDownLastFrame: this.nextAvailableCastFrame,
      abilityName: this.name
    }
    this.hero.player.socket.emit("S:CASTING", casting);
  }

  // Checks abilities that require hero to be within range of target are actually within range
  isInRange(): boolean {
    if (this.castRestriction != CastRestriction.InRange) {
      return true;
    }
    const ability: IAbility = Abilities[this.name];
    if (ability.range == 0) {
      return true;
    }
    const distance: number = Vector.createFromPoints(
      this.hero.model.getPosition(),
      this.targetPosition)
      .getMagnitude();
    return distance <= ability.range;
  }

  onUpdate(): void {
    return;
  }

  // Called by parent class on game loop update
  update(): void {
    // Only update while executing
    if (this.nextAvailableCastFrame <= Game.getInstance().currentFrame) {
      return;
    }

    this.onUpdate();
  }

  hasCastTimeElapsed(): boolean {
    return this.nextAvailableCastFrame < Game.getInstance().currentFrame;
  }
}
export default Ability;
