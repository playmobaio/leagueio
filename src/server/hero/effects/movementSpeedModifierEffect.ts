import Effect from '../effect';
import Hero from '../hero';

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
}
export default MovementSpeedModifierEffect;