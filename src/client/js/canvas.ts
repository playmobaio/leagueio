class Canvas {
  private static instance: Canvas;
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  static getInstance(): Canvas {
    if(!Canvas.instance) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context: CanvasRenderingContext2D = canvas.getContext("2d");
      Canvas.instance = new Canvas(context);
    }
    return Canvas.instance;
  }
}

export default Canvas;