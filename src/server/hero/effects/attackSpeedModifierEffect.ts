import Effect from "../effect";
import Hero from '../hero';

class AttackSpeedModifierEffect extends Effect {
  multiplier: number

  constructor(seconds: number,
      multiplier: number) {
    super(seconds, `attack speed increased by ${multiplier}`);
    this.multiplier = multiplier;
  }

  start(hero: Hero): void {
    hero.attackSpeed *= this.multiplier;
  }

  finish(hero: Hero): void {
    hero.attackSpeed /= this.multiplier;
  }
}
export default AttackSpeedModifierEffect;
