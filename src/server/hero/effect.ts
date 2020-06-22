import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames } from '../tools/frame';
import { IEffect } from '../../models/interfaces';

abstract class Effect implements IEffect{
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

  abstract start(): void;
  abstract finish(): void;

  isExpired(): boolean {
    return this.endTime < Game.getInstance().currentFrame;
  }
}

export default Effect;