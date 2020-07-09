import { IPoint } from '../../../models/interfaces';
import Hero from '../hero';
import Game from '../../models/game';

abstract class Attack {
  hero: Hero;
  lengthInFrames: number;
  lastAttackFrame = 0;

  constructor(hero: Hero, lengthInFrames: number) {
    this.hero = hero;
    this.lengthInFrames = lengthInFrames;
  }

  abstract onExecute(dest: IPoint): void;
  abstract onUpdate(): void;

  execute(dest: IPoint): void {
    // Don't attack while still executing
    if (this.lastAttackFrame > Game.getInstance().currentFrame) {
      return;
    }
    this.onExecute(dest);
    this.lastAttackFrame = Game.getInstance().currentFrame + this.lengthInFrames;
  }

  update(): void {
    // Only update while executing
    if (this.lastAttackFrame <= Game.getInstance().currentFrame) {
      return;
    }

    this.onUpdate();
  }
}
export default Attack;