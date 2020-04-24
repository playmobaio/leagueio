class Loader {
  images: Map<string, HTMLImageElement>;
  constructor() {
    this.images = new Map<string, HTMLImageElement>();
  }

  loadImage(key, src): Promise<HTMLImageElement> {
    const image = new Image();
    image.src = src;
    return new Promise<HTMLImageElement>((resolve, reject): void => {
      image.onload = (): void => {
        this.images[key] = image;
        resolve(image);
      };

      image.onerror = (): void => {
        reject('Could not load image: ' + src);
      };
    });
  }

  getImage(key): HTMLImageElement {
    return key in this.images ? this.images[key] : null;
  }
}

export default Loader;