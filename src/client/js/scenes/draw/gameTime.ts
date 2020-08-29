import HudScene from "../hudScene";
import constants from '../../constants';

const xOffset = constants.DEFAULT_MAP_VIEW_WIDTH / 2;
const yOffset = 20;

function drawGameTime(scene: HudScene, currentFrame: number): void {
  const text = `Score: ${currentFrame}`;
  if (scene.gameTimeText) {
    scene.gameTimeText.setText(text);
    return;
  }
  scene.gameTimeText = scene.add.text(xOffset, yOffset, text, { font: "30px Arial" });
  scene.gameTimeText.setOrigin(0.5, 0.1);
}

export { drawGameTime }