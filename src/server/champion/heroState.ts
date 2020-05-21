import Effect from './effect';
import CastState from './castState';
import Condition from './condition';

class HeroState{
  effects: Effect[];
  condition: Condition;
  castState: CastState;
}
export default HeroState;