import { Velocity, Circle } from "../models/basicTypes";
import { IHealth } from '../../models/interfaces';
import HeroState from './heroState';
import Ability from './ability';

class Hero {
  movementSpeed: Velocity;
  attackSpeed: number;
  health: IHealth;
  model: Circle;
  qAbility: Ability;
  wAbility: Ability;
  eAbility: Ability;
  state: HeroState;
  level: number;
  experience: number;


  cast(): void {
    return;
  }

  performAutoAttack(): void {
    return;
  }
}
export default Hero;