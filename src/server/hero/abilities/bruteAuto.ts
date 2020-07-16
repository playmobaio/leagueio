import Ability from "../ability";
import { VectorBuilder, Vector } from '../../models/basicTypes';
import modelConstants from '../../../models/constants';
import serverConstants from '../../constants';
import { CastRestriction } from '../../../models/interfaces';
import { secondsToFrames } from '../../tools/frame';

class BruteAuto extends Ability {
  cooldown = serverConstants.BRUTE_COOL_DOWN;
  name = modelConstants.BRUTE_AUTO;
  attackVector: Vector;
  castRestriction = CastRestriction.None;

  onCast(): void {
    this.attackVector = VectorBuilder.createFromPoints(this.hero.model.getPosition(), this.targetPosition)
      .setMagnitude(serverConstants.BRUTE_MELEE_RANGE)
      // Start from 90 degrees clockwise
      .rotateCounterClockWise(Math.PI * 3 / 2)
      .build();
  }

  onUpdate(): void {
    // rotate the vector at the fixed rate
    this.attackVector = VectorBuilder.createFromVector(this.attackVector)
      .rotateCounterClockWise(this.radiansPerFrame())
      .build();
  }

  radiansPerFrame(): number {
    // we want to rotate 180 degrees; set the degree / update rate
    return Math.PI / secondsToFrames(serverConstants.BRUTE_ATTACK_LENGTH);
  }
}

export default BruteAuto;
