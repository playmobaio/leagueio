import Ability from "../ability";
import constants from '../../../models/constants';
import { CastRestriction } from '../../../models/interfaces/iAbility';

class HailOfArrows extends Ability {
  cooldown = 18;
  name = constants.HAIL_OF_ARROWS;
  castRestriction = CastRestriction.InRange;

  onCast(): void {
    console.log("Casting Hail of Arrows");
    //    const shape = Abilities[this.name].castingShape as ICircle;
    //    const point = new Point(this.targetPosition.x, this.targetPosition.y);
    //    const circle = new Circle(shape.radius, point);
    //    const game = Game.getInstance();
    //    game.players.forEach((player) => {
    //      if (player.id != this.hero.player.id &&
    //        player.hero?.model?.collidesWithCircle(circle)) {
    //        player.receiveDamage(15);
    //      }
    //    });
  }
}

export default HailOfArrows;
