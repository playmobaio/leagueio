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
  w = 1,
  a = 2,
  s = 4,
  d = 8
}
