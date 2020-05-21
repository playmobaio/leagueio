import Effect from './effect';
import CastState from './castState';

class HeroState{
  effects: Effect[];
  condition: Condition;
  castState: CastState;
}
export default HeroState;