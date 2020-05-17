import Camera from './camera';
import { Layer, Tile } from '../../models/interfaces';
import TileMap from '../../models/tileMap';

class Layers {
  tileImage: HTMLImageElement;
  tileMap: TileMap;
  tileSize: number;
  width: number;
  height: number;

  private constructor() {
    this.tileMap = new TileMap();
    this.tileSize= this.tileMap.tileSize;
    this.width = this.tileMap.cols * this.tileMap.tileSize
    this.height = this.tileMap.rows * this.tileMap.tileSize
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
        this.tileImage = image;
        resolve();
      };

      image.onerror = (): void => {
        reject('Could not load image: ' + image.src);
      };
    });
  }

  drawLayer(context: CanvasRenderingContext2D, camera: Camera, layer: Layer): void {
    const startCol = Math.floor(camera.absolutePosition.x / this.tileSize);
    const endCol = startCol + camera.width / this.tileSize;
    const startRow = Math.floor(camera.absolutePosition.y / this.tileSize);
    const endRow = startRow + camera.height / this.tileSize;
    const offsetX = -camera.absolutePosition.x + startCol * this.tileSize;
    const offsetY = -camera.absolutePosition.y + startRow * this.tileSize;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const tile: Tile = this.tileMap.getTile(layer, c, r);
        const x = Math.round((c - startCol) * this.tileSize + offsetX);
        const y = Math.round((r - startRow) * this.tileSize + offsetY);
        if (tile !== Tile.Empty) {
          this.drawTile(context, tile, x, y);
        }
      }
    }
  }

  drawTile(context: CanvasRenderingContext2D, tile: Tile, x: number, y: number): void {
    context.drawImage(
      this.tileImage, // image
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
}

export default Layers