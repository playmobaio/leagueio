import GameScene from "../gameScene";
import { IPlayer } from '../../../../models/interfaces';
import constants from '../../constants';

const healthBarOffset = 8;
const healthBarHeight = 5;

function drawHealthBar(scene: GameScene, player: IPlayer): void {
  const YOffset = player.hero.model.radius + healthBarOffset;
  let healthBarSize: number = Math.ceil(
    player.health.current / player.health.maximum * constants.HEALTH_BAR_LENGTH
  );
  healthBarSize = Math.max(healthBarSize, 0);
  const position = player.hero.model.position;

  const x = position.x;
  const y = position.y - YOffset;
  const healthBar = scene.add.rectangle(x, y, healthBarSize, healthBarHeight, 0xff0000);
  scene.gameObjects.push(healthBar);
}

function drawPlayer(scene: GameScene, player: IPlayer): void {
  const userId = scene.socket.id;
  const model = player.hero.model;

  // draw health bar
  drawHealthBar(scene, player);
  const playerArc = scene.add.circle(model.position.x, model.position.y, model.radius, 0);
  // Lock on camera to player model
  if (player.id == userId) {
    scene.cameras.main.startFollow(playerArc);
  }
  scene.gameObjects.push(playerArc);
}

export { drawPlayer }
