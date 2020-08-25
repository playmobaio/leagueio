import { IPoint } from './basicTypes';

export interface IModel {
  position: IPoint;
  type: IShape;
}

export interface ICircleModel extends IModel {
  radius: number;
}

export interface IRectangleModel extends IModel {
  width: number;
  height: number;
  angle: number; // degrees
}

export enum IShape {
  Circle,
  Rectangle
}

