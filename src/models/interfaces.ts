export interface IPlayer {
  id: string;
  position: IPoint;
}

export interface IPoint {
  x: number;
  y: number;
}

export enum UserIO {
  none = 0,
  up = 1,
  left = 2,
  down = 4,
  right = 8
}
