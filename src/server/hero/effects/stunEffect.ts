import Effect from '../effect';

class StunEffect extends Effect {
  duration: number;

  effectFinishCallback(): void {
    return;
  }
}
export default StunEffect;