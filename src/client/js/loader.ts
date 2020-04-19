class Loader {
  images: Map<string, HTMLImageElement>;
  constructor() {
    this.images = new Map<string, HTMLImageElement>();
  }

  loadImage(key, src): Promise<HTMLImageElement> {
    const img = new Image();
    const d = new Promise<HTMLImageElement>(function(resolve, reject): void {
      img.onload = function(): void {
        this.images[key] = img;
        resolve(img);
      }.bind(this);

      img.onerror = function(): void {
        reject('Could not load image: ' + src);
      };
    }.bind(this));
    img.src = src;
    return d;
  }

  getImage(key): HTMLImageElement {
    return key in this.images ? this.images[key] : null;
  }
}

export default Loader;