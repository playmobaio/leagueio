import { IAbility, Shape, ICircle, HeroID } from "../interfaces";
import constants from '../constants';

const hailOfArrowsCircle: ICircle = {
  origin: null,
  radius: 50,
  type: Shape.Circle,
};

const rapidFire: IAbility = {
  castingShape: null,
  range: 0,
  abilityName: constants.RAPID_FIRE
}

const hailOfArrows: IAbility = {
  castingShape: hailOfArrowsCircle,
  range: 200,
  abilityName: constants.HAIL_OF_ARROWS
};

const HeroAbilities: Record<HeroID, Record<string, IAbility>> = {
  1: {
    "qAbility": rapidFire,
    "wAbility": hailOfArrows,
    "eAbility": null
  },
  2: {
    "qAbility": null,
    "wAbility": null,
    "eAbility": null
  }
}

const Abilities: Record<string, IAbility> = {
  "HailOfArrows": hailOfArrows,
  "RapidFire": rapidFire
};

export {
  HeroAbilities,
  Abilities
}