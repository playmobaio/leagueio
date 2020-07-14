import GameScene from "../gameScene";
import { IPoint } from '../../../../models/interfaces';

function destroyPoint(scene: GameScene): void {
  scene.dest.destroy();
}

function drawPointer(scene: GameScene, cursorPosition: IPoint): void {
  // destroy previous set pointer
  if (scene.dest != null) {
    scene.dest.destroy();
  }
  // add pointer to scene
  scene.dest = scene.add.circle(cursorPosition.x, cursorPosition.y, 2, 0xff0000);
  scene.physics.world.enableBody(scene.dest);

  const player = scene.players.get(scene.socket.id);
  if (player) {
    // If player object overlaps with point we should destroy it
    scene.physics.add.overlap(player, scene.dest, () => {
      destroyPoint(scene);
    });
  }
}

export { drawPointer }