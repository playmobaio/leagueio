import Ability from "../ability";
import AttackSpeedModifierEffect from '../effects/attackSpeedModifierEffect';
import constants from '../../../models/constants';
import { CastRestriction } from '../../../models/interfaces/iAbility';

class RapidFire extends Ability {
  cooldown = 20;
  name = constants.RAPID_FIRE;
  castRestriction = CastRestriction.None;

  onCast(): void {
    console.log("Casting RapidFire");
    const effect = new AttackSpeedModifierEffect(7, 2);
    this.hero.state.addEffect(effect);
  }
}

export default RapidFire;
