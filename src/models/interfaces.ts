export interface IPlayer {
  id: string;
  health: IHealth;
  model: ICircle;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ICircle {
  center: IPoint;
  radius: number;
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

export interface IGameState {
  client: IPlayer;
  players: IPlayer[];
  projectiles: IProjectile[];
  currentFrame: number;
}

export enum PlayerMovementIO {
  None = 0,
  Up = 1,
  Left = 2,
  Down = 4,
  Right = 8,
}

export interface IHealth {
  maximum: number;
  current: number;
}

export enum Layer {
  Background = 0,
  Foreground = 1
}

export enum Tile {
  Empty = 0,
  Grass = 1,
  Building = 2,
  TreeTrunk = 3,
  TreeTop = 4,
  Bush = 5
}