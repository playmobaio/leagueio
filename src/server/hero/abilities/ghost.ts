import Ability from '../ability';
import modelConstants from '../../../models/constants';
import { CastRestriction } from '../../../models/interfaces/iAbility';
import MovementSpeedModifierEffect from '../effects/movementSpeedModifierEffect';
import Hero from '../hero';

class Ghost extends Ability {
  cooldown = 30;
  name = modelConstants.GHOST;
  castRestriction = CastRestriction.None;

  constructor(hero: Hero) {
    super(hero);
    this.castTime = 0;
  }

  onCast(): void {
    console.log("Casting Ghost");
    this.hero.state.addEffect(new MovementSpeedModifierEffect(this.hero, 3, 1.5));
  }
}

export default Ghost;
