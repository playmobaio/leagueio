import Effect from '../effect';

class ShieldEffect extends Effect {
  amount: number;

  effectFinishCallback(): void {
    return;
  }
}
export default ShieldEffect;