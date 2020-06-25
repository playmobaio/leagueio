import Layers from './layer';
import constants from './constants';
import Camera from './camera';
import { Layer, IShape } from '../../models/interfaces';

const CHARS_IN_PX = 2;

class CGameMap {
  private static instance: CGameMap;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  layers: Layers;
  castingShape: IShape;

  private constructor(canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      layers: Layers) {
    this.canvas = canvas;
    this.context = context;
    this.layers = layers;
  }

  static getInstance(): CGameMap {
    if(!CGameMap.instance) {
      const layers: Layers = Layers.getLayers();
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = constants.DEFAULT_MAP_VIEW_WIDTH;
      canvas.height = constants.DEFAULT_MAP_VIEW_HEIGHT;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      const map = new CGameMap(canvas, context, layers);
      CGameMap.instance = map;
    }
    return CGameMap.instance;
  }

  getCanvasDimensions(): [number, number] {
    const widthStr: string = this.canvas.style.width;
    const width: number = parseInt(widthStr.substring(0, widthStr.length - CHARS_IN_PX))
    const heightStr: string = this.canvas.style.height;
    const height: number = parseInt(heightStr.substring(0, heightStr.length - CHARS_IN_PX))
    return [width, height];
  }

  drawLayer(camera: Camera, layer: Layer): void {
    this.layers.drawLayer(this.context, camera, layer);
  }

  resetFrame(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CGameMap;
