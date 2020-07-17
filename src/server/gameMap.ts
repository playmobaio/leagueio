import { Point } from './models/basicTypes';
import constants from '../models/constants';
import TileMap from '../models/tileMap';
import { Layer, Tile } from '../models/interfaces';

class GameMap {
  width: number;
  height: number;
  tileMap: TileMap;

  constructor() {
    this.width = constants.DEFAULT_MAP_WIDTH;
    this.height = constants.DEFAULT_MAP_HEIGHT;
    this.tileMap = new TileMap();
  }

  randomMapPosition(): Point {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    return new Point(x, y);
  }

  isOnMap(point: Point): boolean {
    return point.x > 0 && point.x <= this.width
      && point.y > 0 && point.y <= this.height;
  }

  isSolidTile(point: Point): boolean {
    const col: number = Math.floor(point.x / this.tileMap.tileSize);
    const row: number = Math.floor(point.y / this.tileMap.tileSize);

    return [Layer.Foreground, Layer.Background].reduce((res, _, layer) => {
      const tile = this.tileMap.getTile(layer, col, row);
      const isSolid = tile === Tile.TreeTrunk || tile === Tile.Building;
      return res || isSolid;
    }, false);
  }
}

export default GameMap;
