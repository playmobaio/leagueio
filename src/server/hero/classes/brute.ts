import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Player from '../../models/player';
import CircleModel from '../../models/circleModel';
import { Point } from '../../models/basicTypes';
import constants from '../../constants';
import BruteAuto from '../abilities/bruteAuto';

class Brute extends Hero {
  qAbility = null;
  wAbility = null;
  eAbility = null;
  spawnLocation = new Point(constants.DEFAULT_SPAWN_LOCATION_X, constants.DEFAULT_SPAWN_LOCATION_Y);

  constructor(player: Player) {
    super(player);
    this.model = new CircleModel(this.spawnLocation, constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 2;
    this.autoAttack = new BruteAuto(player.hero);
  }

  onAutoAttack(dest: IPoint): void {
    this.autoAttack.targetPosition = dest;
    this.autoAttack.cast();
  }

  respawn(): void {
    this.model = new CircleModel(this.spawnLocation, constants.DEFAULT_CIRCLE_RADIUS);
  }
}

export default Brute;
