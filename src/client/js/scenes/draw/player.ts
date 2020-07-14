import GameScene from "../gameScene";
import { IPlayer } from '../../../../models/interfaces';

function drawPlayer(scene: GameScene, player: IPlayer): void {
  const userId = scene.socket.id;
  const model = player.hero.model;
  // update player position if they exist
  if (scene.players.has(player.id)) {
    const playerArc = scene.players.get(player.id);
    playerArc.x = model.origin.x;
    playerArc.y = model.origin.y;
    return;
  }
  const playerArc = scene.add.circle(model.origin.x, model.origin.y, model.radius, 0);
  // Lock on camera to player model
  if (player.id == userId) {
    scene.cameras.main.startFollow(playerArc);
  }
  scene.physics.world.enableBody(playerArc);
  scene.players.set(player.id, playerArc);
}

export { drawPlayer }