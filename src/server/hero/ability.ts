import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames } from '../tools/frame';
import constants from '../constants';
import { IShape, IPoint, ICasting } from '../../models/interfaces';

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
    const casting: ICasting = {
      coolDownLastFrame: currFrame + secondsToFrames(this.cooldown),
      abilityName: this.name
    }
    this.hero.player.socket.emit("S:CASTING", casting);
    this.lastCastFrame = currFrame;
  }

  hasCastTimeElapsed(): boolean {
    return this.lastCastFrame + secondsToFrames(this.castTime) < Game.getInstance().currentFrame;
  }
}
export default Ability;