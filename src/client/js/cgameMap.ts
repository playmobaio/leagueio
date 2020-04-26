import Layers from './layer';
import constants from './constants';
import Camera from './camera';
import { Layer } from '../../models/interfaces';

class CGameMap {
  private static instance: CGameMap;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  layers: Layers;

  private constructor(canvas:HTMLCanvasElement, context: CanvasRenderingContext2D, layers: Layers) {
    this.canvas = canvas;
    this.context = context;
    this.layers = layers;
  }

  static async getInstance(): Promise<CGameMap> {
    if(!CGameMap.instance) {
      const layers: Layers = await Layers.createAsync();
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = constants.DEFAULT_MAP_VIEW_WIDTH;
      canvas.height = constants.DEFAULT_MAP_VIEW_HEIGHT;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      const map = new CGameMap(canvas, context, layers);
      CGameMap.instance = map;
    }
    return CGameMap.instance;
  }

  drawLayer(camera: Camera, layer: Layer): void {
    this.layers.drawLayer(this.context, camera, layer);
  }

  resetFrame(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CGameMap;