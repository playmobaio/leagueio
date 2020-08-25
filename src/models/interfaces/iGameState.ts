import { IModel, ICircleModel } from './iModel';

export interface IGameState {
  client: IPlayer;
  players: IPlayer[];
  projectiles: IProjectile[];
  currentFrame: number;
}

export interface IPlayer {
  id: string;
  health: IHealth;
  hero: IHero;
}

export interface IHealth {
  maximum: number;
  current: number;
}

export interface IHero {
  model: ICircleModel;
}

export interface IProjectile {
  id: string;
  model: IModel;
}
