import Effect from '../effect';
import Hero from '../hero';
import { Condition } from '../../../models/interfaces/basicTypes';

class MovementSpeedModifierEffect extends Effect {
  multiplier: number

  constructor(hero: Hero,
      seconds: number,
      multiplier: number) {
    super(hero, seconds, `movement speed modified by ${multiplier}`);
    this.multiplier = multiplier;
  }

  start(): void {
    this.hero.movementSpeed *= this.multiplier;
  }

  finish(): void {
    this.hero.movementSpeed /= this.multiplier;
  }

  causes(): Condition {
    return Condition.Active;
  }
}
export default MovementSpeedModifierEffect;
