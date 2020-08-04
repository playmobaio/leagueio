import {
  IGameState,
  IHero,
  IPoint,
  IShape,
  IModel,
  ICircleModel,
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
  const center: IPoint = camera.absoluteToRelativePosition(hero.model.position);
  gameMap.context.lineWidth = 2;
  drawCircle(gameMap, center, range, constants.PASTEL_RED_HEX);
}

function drawCastModel(gameMap: CGameMap, ability: IAbility): void {
  const model: IModel = ability.model;
  switch(model.type) {
  case IShape.Circle: {
    const circleModel = model as ICircleModel;
    drawCircle(gameMap,
      circleModel.position,
      circleModel.radius,
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
  drawCastModel(gameMap, ability);
}

export default drawCastInfo
