import Hero from './hero';
import Game from '../models/game';
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
    this.startTime = Game.getInstance().currentFrame;
    this.endTime = this.startTime + secondsToFrames(seconds);
    console.log(`StartTime: ${this.startTime}. EndTime: ${this.endTime}`);
    this.description = description;
  }

  isExpired(): boolean {
    return this.endTime < Game.getInstance().currentFrame;
  }

  abstract effectFinishCallback(): void;
}

export default Effect;