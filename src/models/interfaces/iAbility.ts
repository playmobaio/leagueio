import { IModel } from './iModel';

export interface IAbility {
  model: IModel;
  range: number;
  abilityName: string;
}

export enum CastRestriction {
  None,
  InRange
}

export interface ICasting {
  coolDownLastFrame: number;
  abilityName: string;
}
