class Canvas {
  private static instance: Canvas;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(canvas:HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  static getInstance(): Canvas {
    if(!Canvas.instance) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      Canvas.instance = new Canvas(canvas, context);
    }
    return Canvas.instance;
  }
}

export default Canvas;