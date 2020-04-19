import constants from './constants';

class CGamemap {
  private static instance: CGamemap;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(canvas:HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  static getInstance(): CGamemap {
    if(!CGamemap.instance) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = constants.DEFAULT_MAP_VIEW_WIDTH;
      canvas.height = constants.DEFAULT_MAP_VIEW_HEIGHT;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      CGamemap.instance = new CGamemap(canvas, context);
    }
    return CGamemap.instance;
  }
}

export default CGamemap;