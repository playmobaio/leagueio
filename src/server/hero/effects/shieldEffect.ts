import Effect from '../effect';
import Hero from '../hero';

class ShieldEffect extends Effect {
  amount: number;
  start(_: Hero): void {
    return;
  }

  finish(_: Hero): void {
    return;
  }
}
export default ShieldEffect;
