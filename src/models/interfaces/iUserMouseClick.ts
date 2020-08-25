import { IPoint } from './basicTypes';

export interface IUserMouseClick {
  cursorPosition: IPoint;
  click: Click;
}

export enum Click {
  Left,
  Right
}

