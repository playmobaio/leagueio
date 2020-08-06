import { Point } from './models/basicTypes';
import { Body, Polygon } from 'detect-collisions';
import constants from '../models/constants';
import TileMap from '../models/tileMap';
import { Layer, Tile } from '../models/interfaces';
import Model from './models/model';
import Game from './game';

class GameMap {
  width: number;
  height: number;
  tileMap: TileMap;
  mapBoundaries: Body;

  constructor(game: Game) {
    this.width = constants.DEFAULT_MAP_WIDTH;
    this.height = constants.DEFAULT_MAP_HEIGHT;
    this.tileMap = new TileMap();
    this.mapBoundaries = new Polygon(0,
      0,
      [[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]]);
    game.collisionSystem.insert(this.mapBoundaries);
  }

  isModelOnMap(model: Model): boolean {
    return model.collidesWithBody(this.mapBoundaries);
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
    const col: number = Math.floor(point.x / TileMap.tileSize);
    const row: number = Math.floor(point.y / TileMap.tileSize);

    return [Layer.Foreground, Layer.Background].reduce((res, _, layer) => {
      const tile = this.tileMap.getTile(layer, col, row);
      const isSolid = tile === Tile.TreeTrunk || tile === Tile.Building;
      return res || isSolid;
    }, false);
  }
}

export default GameMap;
