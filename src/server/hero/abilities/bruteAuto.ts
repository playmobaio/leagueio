import Ability from "../ability";
import { Vector } from '../../models/basicTypes';
import modelConstants from '../../../models/constants';
import serverConstants from '../../constants';
import { CastRestriction } from '../../../models/interfaces';
import { getFramesBetweenAutoAttack } from '../../tools/frame';

class BruteAuto extends Ability {
  cooldown = 0.5;
  name = modelConstants.BRUTE_AUTO;
  attackVector: Vector;
  castRestriction = CastRestriction.None;
  castTime = 0;

  onCast(): void {
    this.attackVector = Vector.createFromPoints(this.hero.model.origin, this.targetPosition)
      .setMagnitude(serverConstants.BRUTE_MELEE_RANGE);
    // Start from 90 degrees clockwise
    this.attackVector.rotateCounterClockWise(Math.PI * 3 / 2);
  }

  onUpdate(): void {
    // rotate the vector at the fixed rate
    this.attackVector.rotateCounterClockWise(this.radiansPerFrame());
  }

  radiansPerFrame(): number {
    // we want to rotate 180 degrees; set the degree / update rate
    return Math.PI / getFramesBetweenAutoAttack(this.cooldown);
  }
}

export default BruteAuto;