import Hero from './hero';
import { Condition } from '../../models/interfaces/basicTypes';
import { secondsToFrames } from '../tools/frame';

abstract class Effect {
  startTime: number;
  endTime: number;
  description: string;
  hero: Hero;

  constructor(hero: Hero,
      seconds: number,
      description: string) {
    this.hero = hero;
    this.startTime = hero.player.game.currentFrame;
    this.endTime = this.startTime + secondsToFrames(seconds);
    console.log(`StartTime: ${this.startTime}. EndTime: ${this.endTime}`);
    this.description = description;
  }

  abstract start(): void;
  abstract finish(): void;

  causes(): Condition {
    return Condition.Active;
  }

  isExpired(): boolean {
    return this.endTime < this.hero.player.game.currentFrame;
  }
}

export default Effect;
