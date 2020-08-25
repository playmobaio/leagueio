export interface IPoint {
  x: number;
  y: number;
}

export enum Condition {
  Active,
  Stunned,
  Casting,
  Dead
}

export enum Layer {
  Background = 0,
  Foreground = 1
}
