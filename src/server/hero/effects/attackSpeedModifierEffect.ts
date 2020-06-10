import Effect from "../effect";
import Hero from '../hero';

class AttackSpeedModifierEffect extends Effect {
  multiplier: number

  constructor(hero: Hero,
      seconds: number,
      multiplier: number) {
    super(hero, seconds, "Attack speed has been increased");
    hero.attackSpeed *= multiplier;
    this.multiplier = multiplier;
    console.log("Modifying attack speed");
  }

  effectFinishCallback(): void {
    this.hero.attackSpeed /= this.multiplier;
    console.log("Resetting attack speed");
  }
}
export default AttackSpeedModifierEffect;