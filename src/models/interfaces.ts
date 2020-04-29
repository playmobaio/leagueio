import { Circle } from '../server/models/basicTypes';

export interface IPlayer {
  id: string;
  health: IHealth;
  model: Circle;
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

export interface IGameState {
  players: IPlayer[];
  projectiles: IProjectile[];
}

export interface IUserGame {
  user: IPlayer;
  gameState: IGameState;
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
