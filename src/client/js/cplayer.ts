import {IPlayer, Point} from '../../types/basicTypes';

class CPlayer implements IPlayer {
  id: string;
  position: Point;

  constructor(id: string, point: Point) {
    this.id = id;
    this.position = point;
  }

  updatePosition(point: Point): void {
    this.position = point;
  }
}

export default CPlayer;