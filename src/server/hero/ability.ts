import Hero from './hero';
import Game from '../game';
import { secondsToFrames } from '../tools/frame';
import constants from '../constants';
import { ICasting } from '../../models/interfaces/iAbility';
import { IAbility, CastRestriction } from '../../models/interfaces/iAbility';
import { Abilities } from '../../models/data/heroAbilities';
import { Vector, Point } from '../models/basicTypes';

abstract class Ability {
  cooldown: number;
  castTime: number;
  nextAvailableCastFrame: number;
  castTimeExpiration: number;
  range: number;
  hero: Hero;
  targetPosition: Point;
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
      this.hero.updateVelocity(this.targetPosition);
      this.hero.state.queueCast(this);
      return;
    }
    if (this.hero.state.isQueuedCast(this)) {
      this.hero.stopHero();
    }
    this.hero.state.addCasting(this);
    this.hero.state.clearQueueCast();
    this.nextAvailableCastFrame = currFrame + secondsToFrames(this.cooldown);
    this.castTimeExpiration = currFrame + secondsToFrames(this.castTime);
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

  hasCastTimeElapsed(): boolean {
    return this.castTimeExpiration < Game.getInstance().currentFrame;
  }
}
export default Ability;
