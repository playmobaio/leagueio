import constants from './constants';

class CGameMap {
  private static instance: CGameMap;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(canvas:HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  static getInstance(): CGameMap {
    if(!CGameMap.instance) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = constants.DEFAULT_MAP_VIEW_WIDTH;
      canvas.height = constants.DEFAULT_MAP_VIEW_HEIGHT;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      CGameMap.instance = new CGameMap(canvas, context);
    }
    return CGameMap.instance;
  }
}

export default CGameMap;