import { IProjectile } from '../../../../models/interfaces/iGameState';
import { IShape, ICircleModel, IModel } from '../../../../models/interfaces/iModel';
import GameScene from '../gameScene';

function drawProjectile(scene: GameScene, projectile: IProjectile): void {
  const model: IModel = projectile.model;
  switch(model.type) {
  case IShape.Circle: {
    const circleModel = model as ICircleModel;
    const projectileArc: Phaser.GameObjects.Arc = scene.add.circle(
      circleModel.position.x,
      circleModel.position.y,
      circleModel.radius,
      0x13220);
    scene.gameObjects.push(projectileArc);
    break;
  }
  default: {
    console.log("unimplemented");
    break;
  }
  }
}

export {
  drawProjectile
}
