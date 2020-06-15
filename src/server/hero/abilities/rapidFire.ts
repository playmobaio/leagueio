import Ability from "../ability";
import AttackSpeedModifierEffect from '../effects/attackSpeedModifierEffect';

class RapidFire extends Ability {
  castLength = 7;
  cooldown = 20;

  onCast(): void {
    const effect = new AttackSpeedModifierEffect(this.hero, this.castLength, 2);
    this.hero.state.addEffect(effect);
  }
}

export default RapidFire;