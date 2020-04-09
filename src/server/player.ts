import constants from './constants';

class Player {
  public id: string;
  public x: number;
  public y: number;

  constructor(id: string) {
    this.id = id;
    this.x = Math.floor(Math.random() * constants.MAPSIZE);
    this.y = Math.floor(Math.random() * constants.MAPSIZE);
  }

  updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export default Player;