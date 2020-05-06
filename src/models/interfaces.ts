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
}

export enum PlayerMovementIO {
  none = 0,
  up = 1,
  left = 2,
  down = 4,
  right = 8,
}

export interface IHealth {
  maximum: number;
  current: number;
}

export enum Layer {
  background = 0,
  foreground = 1
}

export enum Tile {
  empty = 0,
  grass = 1,
  building = 2,
  trunk = 3,
  top = 4,
  bush = 5,
  blocker = 6
}