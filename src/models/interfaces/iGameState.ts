import { ICircleModel } from './iModel';
import { IPoint } from './basicTypes';

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
  projectileType: ProjectileType;
  position: IPoint;
  angle?: number; // optional for circle models, in radians
  armed?: boolean; // optional
}

export enum ProjectileType {
  Meteor,
  EzrealUltimate,
  RangerAutoAttack,
  FinalSpark,
  MysticShot
}
