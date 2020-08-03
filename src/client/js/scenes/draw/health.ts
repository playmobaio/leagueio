import { IPlayer } from "../../../../models/interfaces";
import HudScene from "../hudScene";

const HEALTH_X = 10;
const HEALTH_Y = 50;

function drawHealth(scene: HudScene, player: IPlayer): void {
  const text = `Health: ${player.health.current}`;
  if (scene.healthText) {
    scene.healthText.setText(text);
    return;
  }
  scene.healthText = scene.add.text(HEALTH_X, HEALTH_Y, text, { fontSize: "30px" });
}

export { drawHealth }