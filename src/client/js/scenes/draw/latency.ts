import HudScene from '../hudScene';

const yOffset = 30;
const xOffset = 150;

export default function drawLatency(scene: HudScene): void {
  if (scene.latency == null) {
    return;
  }
  const text = `${scene.latency} ms`;
  if (scene.latencyText) {
    scene.latencyText.setText(text);
    return;
  }
  scene.latencyText = scene.add.text(xOffset, yOffset, text, { font: "12px Arial" });
  scene.latencyText.setOrigin(0.5);
}