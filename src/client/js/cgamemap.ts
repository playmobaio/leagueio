import constants from './constants';
import { IGameState } from '../../models/interfaces';

class CGameMap {
  private static instance: CGameMap;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  tileMap: HTMLImageElement;

  constructor(canvas:HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  drawLayer(gameState: IGameState, layer: number): void {
    gameState.tiles[layer].forEach(tile => {
      this.context.drawImage(
        this.tileMap, // image
        (tile.tile - 1) * gameState.tileSize, // source x
        0, // source y
        gameState.tileSize, // source width
        gameState.tileSize, // source height
        tile.position.x,  // target x
        tile.position.y, // target y
        gameState.tileSize, // target width
        gameState.tileSize // target height
      );
    });
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

  static async getInstance(): Promise<CGameMap> {
    if(!CGameMap.instance) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = constants.DEFAULT_MAP_VIEW_WIDTH;
      canvas.height = constants.DEFAULT_MAP_VIEW_HEIGHT;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      const map = new CGameMap(canvas, context);
      await map.loadTileMap();
      CGameMap.instance = map;
    }
    return CGameMap.instance;
  }
}

export default CGameMap;