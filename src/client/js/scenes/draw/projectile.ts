import { IProjectile, ProjectileType } from '../../../../models/interfaces/iGameState';
import projectileConstants from '../../../../models/constants/projectileConstants';
import { IPoint } from '../../../../models/interfaces/basicTypes';
import GameScene from '../gameScene';

const FILL_ALPHA = 0.8; // opacity ratio

function drawCircleProjectile(
  scene: GameScene,
  position: IPoint,
  radius: number,
  borderColor: number,
  shouldFill = false,
  borderWidth = 1,
  fillColor?: number): void {

  const graphics: Phaser.GameObjects.Graphics = scene.add.graphics();
  graphics.lineStyle(borderWidth, borderColor);
  graphics.strokeCircle(position.x, position.y, radius);

  if (shouldFill) {
    fillColor = fillColor != null ? fillColor : borderColor;
    graphics.fillStyle(fillColor, FILL_ALPHA);
    graphics.fillCircle(position.x, position.y, radius);
  }
  scene.gameObjects.push(graphics);
}

function drawRectangleProjectile(
  scene: GameScene,
  position: IPoint,
  height: number,
  width: number,
  angle: number,
  borderColor: number,
  shouldFill = false,
  borderWidth = 1,
  fillColor?: number): void {

  const graphics: Phaser.GameObjects.Graphics = scene.add.graphics();
  graphics.lineStyle(borderWidth, borderColor);
  graphics.setPosition(position.x, position.y);
  graphics.strokeRect(0, 0, width, height);

  if (shouldFill) {
    fillColor = fillColor != null ? fillColor : borderColor;
    graphics.fillStyle(fillColor, FILL_ALPHA);
    graphics.fillRect(0, 0, width, height);
  }

  graphics.setRotation(angle);
  scene.gameObjects.push(graphics);
}

function drawProjectile(scene: GameScene, projectile: IProjectile): void {
  const projectileType: ProjectileType = projectile.projectileType;
  const position: IPoint = projectile.position;
  switch(projectileType) {
  case ProjectileType.EzrealUltimate: {
    drawRectangleProjectile(
      scene,
      position,
      projectileConstants.EzrealUltimate.height,
      projectileConstants.EzrealUltimate.width,
      projectile.angle,
      projectileConstants.EzrealUltimate.color,
      true,
    );
    break;
  }
  case ProjectileType.Meteor: {
    drawCircleProjectile(
      scene,
      position,
      projectileConstants.Meteor.radius,
      projectileConstants.Meteor.borderColor,
      projectile.armed, // only fill the circle when the projectile is armed
      1,
      projectileConstants.Meteor.fillColor
    );
    break;
  }
  case ProjectileType.RangerAutoAttack: {
    drawCircleProjectile(
      scene,
      position,
      projectileConstants.RangerAutoAttack.radius,
      projectileConstants.RangerAutoAttack.color
    );
    break;
  }
  case ProjectileType.FinalSpark: {
    drawRectangleProjectile(
      scene,
      position,
      projectileConstants.FinalSpark.height,
      projectileConstants.FinalSpark.width,
      projectile.angle,
      projectileConstants.FinalSpark.color,
      projectile.armed
    );
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
