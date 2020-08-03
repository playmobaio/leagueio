import HudScene from "../hudScene";

const TIME_X = 800;
const TIME_Y = 20;

function drawGameTime(scene: HudScene, currentFrame: number): void {
  const text = `Score: ${currentFrame}`;
  if (scene.gameTimeText) {
    scene.gameTimeText.setText(text);
    return;
  }
  scene.gameTimeText = scene.add.text(TIME_X, TIME_Y, text, { fontSize: "30px" });
}

export { drawGameTime }