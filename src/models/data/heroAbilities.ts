import { HeroID } from "../interfaces/iJoinGame";
import { IShape, ICircleModel } from "../interfaces/iModel";
import { IAbility } from "../interfaces/iAbility";
import constants from '../constants';

const hailOfArrowsCircle: ICircleModel = {
  position: null,
  radius: 50,
  type: IShape.Circle,
};

const rapidFire: IAbility = {
  model: null,
  range: 0,
  abilityName: constants.RAPID_FIRE
}

const hailOfArrows: IAbility = {
  model: hailOfArrowsCircle,
  range: 200,
  abilityName: constants.HAIL_OF_ARROWS
};

const flash: IAbility = {
  model: null,
  range: 0,
  abilityName: constants.FLASH
};

const ghost: IAbility = {
  model: null,
  range: 0,
  abilityName: constants.GHOST
}

const HeroAbilities: Record<HeroID, Record<string, IAbility>> = {
  0: {
    "qAbility": null,
    "wAbility": null,
    "eAbility": null,
    "dAbility": ghost,
    "fAbility": flash
  },
  1: {
    "qAbility": rapidFire,
    "wAbility": hailOfArrows,
    "eAbility": null,
    "dAbility": ghost,
    "fAbility": flash
  },
  2: {
    "qAbility": null,
    "wAbility": null,
    "eAbility": null,
    "dAbility": ghost,
    "fAbility": flash
  }
}

const Abilities: Record<string, IAbility> = {
  "HailOfArrows": hailOfArrows,
  "RapidFire": rapidFire,
  "Flash": flash,
  "Ghost": ghost
};

export {
  HeroAbilities,
  Abilities
}
