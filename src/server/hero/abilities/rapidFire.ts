import Ability from "../ability";
import AttackSpeedModifierEffect from '../effects/attackSpeedModifierEffect';
import constants from '../../../models/constants';

class RapidFire extends Ability {
  cooldown = 20;
  name = constants.RAPID_FIRE;

  onCast(): void {
    console.log("Using RapidFire");
    const effect = new AttackSpeedModifierEffect(this.hero, 7, 2);
    this.hero.state.addEffect(effect);
  }
}

export default RapidFire;