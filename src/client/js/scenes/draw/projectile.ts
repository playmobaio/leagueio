import { IProjectile } from '../../../../models/interfaces';
import GameScene from '../gameScene';

function drawProjectile(scene: GameScene, projectile: IProjectile): void {
  const projectileArc: Phaser.GameObjects.Arc = scene.add.circle(
    projectile.model.origin.x,
    projectile.model.origin.y,
    projectile.model.radius,
    0x13220);
  scene.gameObjects.push(projectileArc);
}

export {
  drawProjectile
}
