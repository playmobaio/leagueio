import constants from '../constants';
import { Point } from './basicTypes';

class Gamemap {
  width: number;
  height: number;

  constructor(x = constants.DEFAULT_MAP_SIZE, y = constants.DEFAULT_MAP_SIZE) {
    this.width = x;
    this.height = y;
  }

  randomMapPosition(): Point {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    return new Point(x, y);
  }
}

export default Gamemap;