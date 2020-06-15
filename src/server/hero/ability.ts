import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames, framesToSeconds } from '../tools/frame';
import constants from '../constants';
import { IAbility, IShape } from '../../models/interfaces';

abstract class Ability {
  cooldown: number;
  castLength: number;
  lastCastFrame: number;
  range: number;
  hero: Hero;
  area: IShape;

  constructor(hero: Hero) {
    this.hero = hero;
    this.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    this.castLength = constants.DEFAULT_CAST_LENGTH;
  }

  abstract onCast(): void;

  useAbility(): void {
    return;
  }

  cast(): void {
    const currFrame = Game.getInstance().currentFrame;
    if (this.lastCastFrame + secondsToFrames(this.cooldown) > currFrame) {
      return;
    }
    this.onCast();
    this.hero.state.addCasting(this);
    this.lastCastFrame = currFrame;
  }

  isExpired(): boolean {
    return this.lastCastFrame + secondsToFrames(this.castLength) < Game.getInstance().currentFrame;
  }

  getCooldownLeft(): number {
    let secondsLeft = 0;
    if (this.lastCastFrame > 0) {
      const sinceCast = framesToSeconds(Game.getInstance().currentFrame - this.lastCastFrame);
      const cooldownLeft = this.cooldown - sinceCast;
      secondsLeft = Math.max(secondsLeft, cooldownLeft);
    }
    return secondsLeft;
  }

  toInterface(): IAbility {
    if (this.area == null || this.range == null) {
      return null;
    }
    return {
      area: this.area,
      range: this.range
    }
  }
}
export default Ability;