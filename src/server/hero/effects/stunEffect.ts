import Hero from '../hero';
import Effect from '../effect';
import Condition from '../condition';

class StunEffect extends Effect {
  duration: number;

  constructor(seconds: number) {
    super(seconds, `stunned for ${seconds} seconds`);
  }

  start(_: Hero): void {
    return;
  }

  finish(_: Hero): void {
    return;
  }

  causes(): Condition {
    return Condition.Stunned;
  }
}
export default StunEffect;
