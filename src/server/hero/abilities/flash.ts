import Ability from '../ability';
import modelConstants from '../../../models/constants';
import { CastRestriction } from '../../../models/interfaces/iAbility';
import { VectorBuilder } from '../../models/basicTypes';
import Hero from '../hero';

class Flash extends Ability {
  static range = 100;
  cooldown = 60;
  name = modelConstants.FLASH;
  castRestriction = CastRestriction.None;

  constructor(hero: Hero) {
    super(hero);
    this.castTime = 0;
  }

  onCast(): void {
    console.log("Casting Flash");
    const startingPosition = this.hero.model.getPosition();
    const movementVector = VectorBuilder.createFromPoints(startingPosition, this.targetPosition)
      .setMagnitude(Flash.range)
      .build();
    this.hero.model.updatePosition(startingPosition.transformWithVector(movementVector));
  }
}

export default Flash;
