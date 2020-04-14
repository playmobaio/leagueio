export interface IPlayer {
  id: string;
  position: IPoint;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IUserInput {
  io: UserIO;
  position: IPoint;
}

export interface IProjectile {
  id: string;
  position: IPoint;
}

export enum UserIO {
  none = 0,
  up = 1,
  left = 2,
  down = 4,
  right = 8,
  click = 16
}