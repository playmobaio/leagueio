import { Point } from './basicTypes';
import { ITile } from '../../models/interfaces';
import Camera from './camera';

class GameMap {
  width: number;
  height: number;
  cols: number;
  rows: number;
  tileSize: number;
  maxX: number;
  maxY: number;
  layers: Array<Array<number>>;

  constructor() {
    this.rows = 18;
    this.cols = 26;
    this.tileSize = 64;
    this.width = this.cols * this.tileSize;
    this.height = this.rows * this.tileSize;
    this.layers = [[
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
      6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 6,
      6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 6,
      6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 6, 6, 1, 1, 6,
      6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 1, 1, 6,
      6, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 6,
      6, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 6,
      6, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6,
      6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6,
      6, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6,
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6
    ], [
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
      6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 6,
      6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 0, 0, 0, 0, 0, 0, 6,
      6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 2, 0, 0, 6,
      6, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 6,
      6, 4, 4, 4, 4, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 6,
      6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 6,
      6, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6,
      6, 0, 0, 2, 2, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6,
      6, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6,
      6, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6,
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6
    ]];
  }

  randomValidMapPosition(): Point {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    return new Point(x, y);
  }

  getLayers(camera: Camera): Array<Array<ITile>> {
    const tiles = Array<Array<ITile>>();
    const startCol = Math.floor(camera.absolutePosition.x / this.tileSize);
    const endCol = startCol + camera.width / this.tileSize;
    const startRow = Math.floor(camera.absolutePosition.y / this.tileSize);
    const endRow = startRow + camera.height / this.tileSize;
    const offsetX = -camera.absolutePosition.x + startCol * this.tileSize;
    const offsetY = -camera.absolutePosition.y + startRow * this.tileSize;

    for (let layer = 0; layer < this.layers.length; layer++) {
      const _layers = Array<ITile>();
      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const tile = this.getTile(layer, c, r);
          const x = Math.round((c - startCol) * this.tileSize + offsetX);
          const y = Math.round((r - startRow) * this.tileSize + offsetY);
          if (tile !== 0) { // 0 => empty tile
            _layers.push({
              tile: tile,
              position: { x: x, y: y }
            });
          }
        }
      }
      tiles.push(_layers);
    }
    return tiles;
  }

  getTile(layer, col, row): number {
    return this.layers[layer][row * this.cols + col];
  }

  isSolidTileAtXY(x, y): boolean {
    const col: number = Math.floor(x / this.tileSize);
    const row: number = Math.floor(y / this.tileSize);

    // tiles 3, 5, 6 are solid -- the rest are walkable
    // loop through all layers and return TRUE if any tile is solid
    return this.layers.reduce(function(res, _, index) {
      const tile = this.getTile(index, col, row);
      const isSolid = tile === 3 || tile === 5 || tile == 6;
      return res || isSolid;
    }, false);
  }

  getCol(x): number {
    return Math.floor(x / this.tileSize);
  }

  getRow(y): number {
    return Math.floor(y / this.tileSize);
  }

  getX(col): number {
    return col * this.tileSize;
  }

  getY(row): number {
    return row * this.tileSize;
  }
}

export default GameMap;