import { IAbility, Shape, ICircle, HeroID } from "../interfaces";
import constants from '../constants';

const hailOfArrowsCircle: ICircle = {
  origin: null,
  radius: 50,
  type: Shape.Circle,
};

const HeroAbilities: Record<HeroID, Record<string, IAbility>> = {
  1: {
    "qAbility": {
      castingShape: null,
      range: 0,
      abilityName: constants.RAPID_FIRE
    },
    "wAbility": {
      castingShape: hailOfArrowsCircle,
      range: 200,
      abilityName: constants.HAIL_OF_ARROWS
    },
    "eAbility": null
  },
  2: {
    "qAbility": null,
    "wAbility": null,
    "eAbility": null
  }
}

export default HeroAbilities;