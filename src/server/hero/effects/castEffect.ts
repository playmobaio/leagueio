import Effect from '../effect';
import Hero from '../hero';
import Condition from '../condition';

class CastEffect extends Effect {
  constructor(seconds: number) {
    super(seconds, `hero casting for ${seconds} seconds`);
  }

  start(_: Hero): void {
    return;
  }

  finish(_: Hero): void {
    return;
  }

  causes(): Condition {
    return Condition.Casting
  }
}
export default CastEffect;
