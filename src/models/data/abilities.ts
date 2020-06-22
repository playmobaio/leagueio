import { IAbility, Shape, ICircle } from "../interfaces";
import constants from '../constants';

const hailOfArrowsCircle: ICircle = {
  origin: { x: -100, y: -100 },
  radius: 50,
  type: Shape.Circle,
};

const Abilities: Record<string, IAbility> = {
  "HailOfArrows": {
    castingShape: hailOfArrowsCircle,
    range: 200,
    abilityName: constants.HAIL_OF_ARROWS
  },
  "RapidFire": null
}

export default Abilities;