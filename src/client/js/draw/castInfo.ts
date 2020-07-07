import {
  IGameState,
  IHero,
  IPoint,
  Shape,
  IShape,
  ICircle,
  IAbility
} from '../../../models/interfaces';
import CGameMap from '../cgameMap';
import Camera from '../camera';
import { drawCircle } from './shape';
import constants from '../constants';
import UserInputController from '../userInputController';
import Game from '../game';

function drawRange(gameMap: CGameMap, camera: Camera, hero: IHero, ability: IAbility): void {
  const range: number = ability.range;
  if (range == null) {
    return;
  }
  const center: IPoint = camera.absoluteToRelativePosition(hero.model.origin);
  gameMap.context.lineWidth = 2;
  drawCircle(gameMap, center, range, constants.PASTEL_RED_HEX);
}

function drawCastShape(gameMap: CGameMap, ability: IAbility): void {
  const shape: IShape = ability.castingShape;
  switch(shape.type) {
  case Shape.Circle: {
    const circle = shape as ICircle;
    drawCircle(gameMap,
      circle.origin,
      circle.radius,
      constants.PASTEL_RED_HEX,
      true,
      constants.PASTEL_RED_HEX);
    break;
  }
  }
}

function drawCastInfo(gameMap: CGameMap, camera: Camera, state: IGameState): void {
  const ability: IAbility = UserInputController
    .getInstance(null)
    .getCastingAbility();
  // Don't draw if we are on cooldown
  if (ability == null || Game.getInstance().onCoolDown(ability.abilityName)) {
    return;
  }

  drawRange(gameMap, camera, state.client.hero, ability);
  drawCastShape(gameMap, ability);
}

export default drawCastInfo
