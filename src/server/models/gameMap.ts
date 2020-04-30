import { Point } from './basicTypes';
import constants from '../../models/constants';

class GameMap {
  width: number;
  height: number;

  constructor() {
    this.width = constants.DEFAULT_MAP_WIDTH;
    this.height = constants.DEFAULT_MAP_HEIGHT;
  }

  randomValidMapPosition(): Point {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    return new Point(x, y);
  }
}

export default GameMap;