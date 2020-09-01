export interface IPoint {
  x: number;
  y: number;
}

export enum ICondition {
  Active = 0,
  Casting = 1,
  Stunned = 2,
  Dead = 3
}

export enum Layer {
  Background = 0,
  Foreground = 1
}
