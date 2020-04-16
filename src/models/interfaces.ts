export interface IPlayer {
  id: string;
  position: IPoint;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IUserInput {
  io: PlayerMovementIO;
}

export interface IUserMouseClick {
  cursorPosition: IPoint;
}

export interface IProjectile {
  id: string;
  position: IPoint;
}

export enum PlayerMovementIO {
  none = 0,
  up = 1,
  left = 2,
  down = 4,
  right = 8,
}
