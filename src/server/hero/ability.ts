import Hero from './hero';
import Game from '../models/game';
import { secondsToFrames } from '../tools/frame';
import constants from '../constants';
import { IShape, IPoint, ICasting, IAbility } from '../../models/interfaces';
import { Abilities } from '../../models/data/heroAbilities';
import { Vector } from '../models/basicTypes';

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
    if (!this.isInRange()) {
      this.hero.updateVelocity(this.targetPosition);
      this.hero.state.queueCast(this);
      return;
    }
    if (this.hero.state.hasQueuedCast()) {
      this.hero.stopHero();
    }
    this.hero.state.addCasting(this);
    const casting: ICasting = {
      coolDownLastFrame: currFrame + secondsToFrames(this.cooldown),
      abilityName: this.name
    }
    this.hero.player.socket.emit("S:CASTING", casting);
    this.lastCastFrame = currFrame;
  }

  isInRange(): boolean {
    const ability: IAbility = Abilities[this.name];
    if (ability.range == 0) {
      return true;
    }
    const distance: number = Vector.createFromPoints(
      this.hero.model.origin,
      this.targetPosition)
      .getMagnitude();
    return distance <= ability.range;
  }

  hasCastTimeElapsed(): boolean {
    return this.lastCastFrame + secondsToFrames(this.castTime) < Game.getInstance().currentFrame;
  }
}
export default Ability;