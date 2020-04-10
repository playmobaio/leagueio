import constants from '../constants';
import { Point } from '../../types/basicTypes';

class Map {
  public width: number;
  public height: number;

  constructor(x: number= constants.DEFAULT_MAP_SIZE, y: number= constants.DEFAULT_MAP_SIZE) {
    this.width = x;
    this.height = y;
  }
  
  randomMapPosition(): Point {
    return new Point(Math.random() * this.width, Math.random() * this.height);
  }
}

export default Map;