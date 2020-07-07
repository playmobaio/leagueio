import Ability from "../ability";
import AttackSpeedModifierEffect from '../effects/attackSpeedModifierEffect';
import constants from '../../../models/constants';
import { CastRestrictions } from '../../../models/interfaces';

class RapidFire extends Ability {
  cooldown = 20;
  name = constants.RAPID_FIRE;
  castRestriction = CastRestrictions.AllRanges;

  onCast(): void {
    console.log("Casting RapidFire");
    const effect = new AttackSpeedModifierEffect(this.hero, 7, 2);
    this.hero.state.addEffect(effect);
  }
}

export default RapidFire;