import Hero from '../hero';
import Effect from '../effect';
import { Condition } from '../../../models/interfaces/basicTypes';

class StunEffect extends Effect {
  duration: number;

  constructor(hero: Hero, seconds: number) {
    super(hero, seconds, `stunned for ${seconds} seconds`);
  }

  start(): void {
    return;
  }

  finish(): void {
    return;
  }

  causes(): Condition {
    return Condition.Stunned;
  }
}
export default StunEffect;
