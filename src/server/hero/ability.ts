import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames, framesToSeconds } from '../tools/frame';
import constants from '../constants';
import { IShape, IAbilityState, IPoint } from '../../models/interfaces';

abstract class Ability {
  cooldown: number;
  castTime: number;
  lastCastFrame: number;
  range: number;
  hero: Hero;
  area: IShape;
  targetPosition: IPoint;
  abstract name: string;

  constructor(hero: Hero) {
    this.hero = hero;
    this.lastCastFrame = constants.DEFAULT_LAST_CAST_FRAME;
    this.castTime = constants.DEFAULT_CAST_LENGTH;
  }

  abstract onCast(): void;

  cast(): void {
    const currFrame = Game.getInstance().currentFrame;
    if (this.lastCastFrame + secondsToFrames(this.cooldown) > currFrame) {
      return;
    }
    this.hero.state.addCasting(this);
    this.lastCastFrame = currFrame;
  }

  hasCastTimeElapsed(): boolean {
    return this.lastCastFrame + secondsToFrames(this.castTime) < Game.getInstance().currentFrame;
  }

  toInterface(): IAbilityState {
    let secondsLeft = 0;
    if (this.lastCastFrame > 0) {
      const sinceCast = Math.floor(
        framesToSeconds(Game.getInstance().currentFrame - this.lastCastFrame)
      );
      const cooldownLeft = this.cooldown - sinceCast;
      secondsLeft = Math.max(secondsLeft, cooldownLeft);
    }
    return {
      cooldown: secondsLeft,
      abilityName: this.name
    };
  }
}
export default Ability;