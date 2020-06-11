import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames } from '../tools/frame';

abstract class Ability {
  cooldown: number;
  castLength: number;
  lastCastFrame: number;
  hero: Hero;

  constructor(hero: Hero) {
    this.hero = hero;
    this.lastCastFrame = -1000000;
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
}
export default Ability;