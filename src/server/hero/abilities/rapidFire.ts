import Ability from "../ability";
import Hero from '../hero';
import AttackSpeedModifierEffect from '../effects/attackSpeedModifierEffect';

class RapidFire extends Ability {
  constructor(hero: Hero) {
    super(hero);
    this.castLength = 7;
    this.cooldown = 20;
  }

  onSuccess(): void {
    return;
  }

  onFailure(): void {
    return;
  }

  onCast(): void {
    const effect = new AttackSpeedModifierEffect(this.hero, this.castLength, 2);
    this.hero.state.addEffect(effect);
  }
}

export default RapidFire;