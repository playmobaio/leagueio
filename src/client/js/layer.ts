import Camera from './camera';
import constants from '../../models/constants';

class Layers {
  rows: number;
  cols: number;
  tileSize: number;
  layers: Array<Array<number>>;
  tileMap: HTMLImageElement;

  constructor() {
    this.rows = constants.DEFAULT_ROWS;
    this.cols = constants.DEFAULT_COLUMNS;
    this.tileSize = constants.DEFAULT_TILE_SIZE;
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

  static async createAsync(): Promise<Layers> {
    const layers = new Layers();
    await layers.loadTileMap();
    return layers;
  }

  loadTileMap(): Promise<void> {
    const image = new Image();
    image.src = '../assets/tiles.png';
    return new Promise<void>((resolve, reject): void => {
      image.onload = (): void => {
        this.tileMap = image;
        resolve();
      };

      image.onerror = (): void => {
        reject('Could not load image: ' + image.src);
      };
    });
  }

  drawLayer(context: CanvasRenderingContext2D, camera: Camera, layer: number): void {
    const startCol = Math.floor(camera.absolutePosition.x / this.tileSize);
    const endCol = startCol + camera.width / this.tileSize;
    const startRow = Math.floor(camera.absolutePosition.y / this.tileSize);
    const endRow = startRow + camera.height / this.tileSize;
    const offsetX = -camera.absolutePosition.x + startCol * this.tileSize;
    const offsetY = -camera.absolutePosition.y + startRow * this.tileSize;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const tile = this.getTile(layer, c, r);
        const x = Math.round((c - startCol) * this.tileSize + offsetX);
        const y = Math.round((r - startRow) * this.tileSize + offsetY);
        if (tile !== 0 && tile !== 6) { // 0 => empty tile
          this.drawTile(context, tile, x, y);
        }
      }
    }
  }

  drawTile(context: CanvasRenderingContext2D, tile: number, x: number, y: number): void {
    context.drawImage(
      this.tileMap, // image
      (tile - 1) * this.tileSize, // source x
      0, // source y
      this.tileSize, // source width
      this.tileSize, // source height
      x,  // target x
      y, // target y
      this.tileSize, // target width
      this.tileSize // target height
    );
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

export default Layers