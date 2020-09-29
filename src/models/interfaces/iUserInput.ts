import { IPoint } from './basicTypes';

export interface IUserInput {
  io: PlayerCastIO;
  cursorPosition: IPoint;
}

export enum PlayerCastIO {
  None = 0,
  Q = 1,
  W = 2,
  E = 3,
  D = 4,
  F = 5,
  S = 6
}

