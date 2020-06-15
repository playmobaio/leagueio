import Ability from "../ability";
import { Condition } from '../../../models/interfaces';
import { Circle } from '../../models/basicTypes';

class HailOfArrows extends Ability {
  cooldown = 18;

  useAbility(): void {
    console.log("using hail of arrows");
    this.range = null;
    this.area = null;
    this.hero.state.setCondition(Condition.Active);
  }
  onCast(): void {
    this.range = 200;
    this.area = new Circle(50, this.hero.model.origin);
    this.hero.state.setCondition(Condition.Casting);
  }
}

export default HailOfArrows;