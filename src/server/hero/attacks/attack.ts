import { IPoint } from '../../../models/interfaces';
import Hero from '../hero';
import Game from '../../models/game';

// Generic container for attacks
abstract class Attack {
  hero: Hero;
  lengthInFrames: number;
  nextAvailableAttackFrame = 0;

  constructor(hero: Hero, lengthInFrames: number) {
    this.hero = hero;
    this.lengthInFrames = lengthInFrames;
  }

  abstract onAttack(dest: IPoint): void;
  abstract onUpdate(): void;

  // Call by parent class when making attack
  attack(dest: IPoint): void {
    // Don't attack while still executing
    if (this.nextAvailableAttackFrame > Game.getInstance().currentFrame) {
      return;
    }
    this.onAttack(dest);
    this.nextAvailableAttackFrame = Game.getInstance().currentFrame + this.lengthInFrames;
  }

  // Called by parent class on game loop update
  update(): void {
    // Only update while executing
    if (this.nextAvailableAttackFrame <= Game.getInstance().currentFrame) {
      return;
    }

    this.onUpdate();
  }
}
export default Attack;