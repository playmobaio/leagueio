import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames, framesToSeconds } from '../tools/frame';
import { IAbility } from '../../models/interfaces';
import constants from '../constants';

abstract class Ability {
  cooldown: number;
  castLength: number;
  lastCastFrame: number;
  hero: Hero;

  constructor(hero: Hero) {
    this.hero = hero;
    this.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
  }

  abstract onSuccess(): void;
  abstract onFailure(): void;
  abstract onCast(): void;

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

  toInterface(): IAbility {
    let secondsLeft = 0;
    if (this.lastCastFrame > 0) {
      const sinceCast = framesToSeconds(Game.getInstance().currentFrame - this.lastCastFrame);
      const cooldownLeft = this.cooldown - sinceCast;
      secondsLeft = Math.max(secondsLeft, cooldownLeft);
    }
    return {
      cooldownLeft: secondsLeft
    }
  }
}
export default Ability;