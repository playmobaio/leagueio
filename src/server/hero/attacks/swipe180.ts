import Attack from './attack';
import { IPoint } from '../../../models/interfaces';
import { Vector } from '../../models/basicTypes';
import Hero from '../hero';
import constants from '../../constants';

class Swipe180 extends Attack {
  attackVector: Vector;

  constructor(hero: Hero, lengthInFrames: number) {
    super(hero, lengthInFrames);
  }

  onAttack(dest: IPoint): void {
    this.attackVector = Vector.createFromPoints(this.hero.model.origin, dest)
      .setMagnitude(constants.BRUTE_MELEE_RANGE);
    // Start from 90 degrees clockwise
    this.attackVector.rotateCounterClockWise(270);
  }

  onUpdate(): void {
    // rotate the vector at the fixed rate
    this.attackVector.rotateCounterClockWise(this.degreesPerFrame());
  }

  degreesPerFrame(): number {
    // we want to rotate 180 degrees; set the degree / update rate
    return 180 / this.lengthInFrames;
  }
}

export default Swipe180;