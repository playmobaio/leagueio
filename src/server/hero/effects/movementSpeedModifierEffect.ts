import Effect from '../effect';

class MovementSpeedModifierEffect extends Effect {
  modiferValue: number

  effectFinishCallback(): void {
    return;
  }
}
export default MovementSpeedModifierEffect;