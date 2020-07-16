import Hero from "../hero";
import { IPoint } from '../../../models/interfaces';
import Projectile from '../../models/projectile';
import Player from '../../models/player';
import CircleModel from '../../models/circleModel';
import { Point } from '../../models/basicTypes';
import constants from '../../constants';
import RapidFire from '../abilities/rapidFire';
import HailOfArrows from '../abilities/hailOfArrows';

class Ranger extends Hero {
  qAbility = new RapidFire(this);
  wAbility = new HailOfArrows(this);
  eAbility = null;
  spawnLocation = new Point(constants.DEFAULT_SPAWN_LOCATION_X, constants.DEFAULT_SPAWN_LOCATION_Y);

  constructor(player: Player) {
    super(player);
    this.model = new CircleModel(this.spawnLocation, constants.DEFAULT_CIRCLE_RADIUS);
    this.attackSpeed = 3;
  }

  onAutoAttack(dest: IPoint): void {
    Projectile.create(this.player,
      this.model.getPosition(),
      dest,
      constants.RANGER_PROJECTILE_RANGE);
  }

  respawn(): void {
    this.model = new CircleModel(this.spawnLocation, constants.DEFAULT_CIRCLE_RADIUS);
  }
}

export default Ranger;
