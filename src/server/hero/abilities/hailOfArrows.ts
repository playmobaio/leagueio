import Ability from "../ability";
import constants from '../../../models/constants';
import { Abilities } from '../../../models/data/heroAbilities';
import { Circle, Point } from '../../models/basicTypes';
import { ICircle } from '../../../models/interfaces';
import Game from '../../models/game';

class HailOfArrows extends Ability {
  cooldown = 18;
  name = constants.HAIL_OF_ARROWS;

  onCast(): void {
    console.log(`Casting Hail of Arrows at ${this.targetPosition.x}, ${this.targetPosition.y}`);
    const shape = Abilities[this.name].castingShape as ICircle;
    const point = new Point(this.targetPosition.x, this.targetPosition.y);
    const circle = new Circle(shape.radius, point);
    const game = Game.getInstance();
    game.players.forEach((player) => {
      if (player.id != this.hero.player.id &&
        player.hero?.model?.collidesWithCircle(circle)) {
        player.receiveDamage(15);
      }
    });
  }
}

export default HailOfArrows;