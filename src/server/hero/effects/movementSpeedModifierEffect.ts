import Effect from '../effect';
import Hero from '../hero';

class MovementSpeedModifierEffect extends Effect {
  multiplier: number

  constructor(seconds: number,
      multiplier: number) {
    super(seconds, `movement speed modified by ${multiplier}`);
    this.multiplier = multiplier;
  }

  start(hero: Hero): void {
    hero.movementSpeed *= this.multiplier;
  }

  finish(hero: Hero): void {
    hero.movementSpeed /= this.multiplier;
  }
}
export default MovementSpeedModifierEffect;
