import Attack from './attack';
import { IPoint } from '../../../models/interfaces';
import { Vector } from '../../models/basicTypes';
import Hero from '../hero';

class Swipe180 extends Attack {
  degreePerUpdate: number;
  attackVector: Vector;

  constructor(hero: Hero, lengthInFrames: number) {
    super(hero, lengthInFrames);
    // we want to rotate 180 degrees; set the degree / update rate
    this.degreePerUpdate = 180 / this.lengthInFrames;
  }

  onExecute(dest: IPoint): void {
    this.attackVector = Vector.createFromPoints(this.hero.model.origin, dest).getUnitVector();
    // Start from 90 degrees clockwise
    this.attackVector.rotateCounterClockWise(270);
  }

  onUpdate(): void {
    // rotate the vector at the fixed reate
    this.attackVector.rotateCounterClockWise(this.degreePerUpdate);
  }
}

export default Swipe180;