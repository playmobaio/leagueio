import GameScene from "../gameScene";
import { IPoint } from '../../../../models/interfaces/basicTypes';

function drawPointer(scene: GameScene, cursorPosition: IPoint): void {
  // destroy previous set pointer
  if (scene.dest != null) {
    scene.dest.destroy();
  }
  // add pointer to scene
  scene.dest = scene.add.circle(cursorPosition.x, cursorPosition.y, 2, 0xff0000);
  scene.physics.world.enableBody(scene.dest);
}

export { drawPointer }
