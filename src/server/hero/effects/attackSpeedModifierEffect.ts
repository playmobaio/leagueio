import Effect from "../effect";
import Hero from '../hero';

class AttackSpeedModifierEffect extends Effect {
  multiplier: number

  constructor(hero: Hero,
      seconds: number,
      multiplier: number) {
    super(hero, seconds, `attack speed increased by ${multiplier}`);
    this.multiplier = multiplier;
  }

  start(): void {
    this.hero.attackSpeed *= this.multiplier;
  }

  finish(): void {
    this.hero.attackSpeed /= this.multiplier;
  }
}
export default AttackSpeedModifierEffect;
