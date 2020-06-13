export interface IPlayer {
  id: string;
  health: IHealth;
  hero: IHero;
  stocks: number;
}

export interface IHeroState {
  condition: Condition,
  casting: IAbility
}

export interface IAbility {
  area: IShape;
  range: number;
}

export interface IHero {
  model: ICircle;
  state: IHeroState;
  qAbility: number;
  wAbility: number;
  eAbility: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IShape {
  type: string;
}

export interface ICircle extends IShape {
  center: IPoint;
  radius: number;
}

export interface IUserInput {
  io: PlayerCastIO;
}

export interface IUserMouseClick {
  cursorPosition: IPoint;
  click: Click;
}

export interface IProjectile {
  id: string;
  model: ICircle;
}

export interface IGameState {
  client: IPlayer;
  players: IPlayer[];
  projectiles: IProjectile[];
  currentFrame: number;
}

export enum HeroID {
  Ranger = 1,
  Brute = 2,
}

export interface IJoinGame {
  name: string;
  heroId: HeroID;
}

export enum PlayerCastIO {
  None = 0,
  Q = 1,
  W = 2,
  E = 3,
}

export enum Click {
  Left,
  Right
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

export enum Condition {
  ACTIVE,
  STUNNED,
  CASTING,
  DEAD
}