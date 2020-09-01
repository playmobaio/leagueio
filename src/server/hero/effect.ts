import Hero from './hero';
import Game from '../game';
import Condition from './condition';
import { secondsToFrames } from '../tools/frame';

abstract class Effect {
  startTime: number;
  endTime: number;
  description: string;

  constructor(seconds: number,
      description: string) {
    this.hero = hero;
    this.startTime = hero.player.game.currentFrame;
    this.endTime = this.startTime + secondsToFrames(seconds);
    console.log(`StartTime: ${this.startTime}. EndTime: ${this.endTime}`);
    this.description = description;
  }

  abstract start(hero: Hero): void;
  abstract finish(hero: Hero): void;

  causes(): Condition {
    return Condition.Active;
  }

  isExpired(): boolean {
    return this.endTime < this.hero.player.game.currentFrame;
  }
}

export default Effect;
