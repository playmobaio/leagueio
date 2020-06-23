import { IGameState, IHero, IPoint, Shape, IShape, ICircle } from '../../../models/interfaces';
import CGameMap from '../cgameMap';
import Camera from '../camera';
import { drawCircle } from './shape';
import constants from '../constants';

function drawRange(gameMap: CGameMap, camera: Camera, hero: IHero): void {
  const range = hero.state.casting.range;
  if (range == null) {
    return;
  }
  const center: IPoint = camera.absoluteToRelativePosition(hero.model.origin);
  gameMap.context.lineWidth = 2;
  drawCircle(gameMap, center, range, constants.PASTEL_RED_HEX);
}

function drawCastArea(gameMap: CGameMap): void {
  const shape: IShape = gameMap.castingShape;
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

function setCastingAreaOrigin(evt: MouseEvent): void {
  const gameMap = CGameMap.getInstance();
  if (gameMap.castingShape == null) {
    return;
  }

  const rect = gameMap.canvas.getBoundingClientRect();
  const point: IPoint = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
  gameMap.castingShape.origin = point;
}

function drawHeroState(gameMap: CGameMap, camera: Camera, state: IGameState): void {
  if (state?.client?.hero?.state?.casting == null) {
    if (gameMap.castingShape) {
      gameMap.castingShape = null;
      gameMap.canvas.removeEventListener("mousemove", setCastingAreaOrigin)
    }
    return;
  }

  drawRange(gameMap, camera, state.client.hero);
  if (gameMap.castingShape == null) {
    gameMap.castingShape = state.client.hero.state.casting.area;
    gameMap.canvas.addEventListener("mousemove", setCastingAreaOrigin);
  } else {
    drawCastArea(gameMap);
  }
}

export default drawHeroState
