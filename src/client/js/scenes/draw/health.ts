import { IPlayer } from "../../../../models/interfaces";
import HudScene from "../hudScene";
import constants from '../../constants';

const x = 510;
const y = 560;

const xTextOffset = -20;
const yTextOffset = -8;

const healthBarWidthMultiplier = 8;

const healthBarHeight = 15;

function drawHealthBar(scene: HudScene, player: IPlayer): void {
  let healthBarSize: number = Math.ceil(
    player.health.current / player.health.maximum
    * constants.HEALTH_BAR_LENGTH * healthBarWidthMultiplier
  );
  healthBarSize = Math.max(healthBarSize, 0);

  if(!scene.healthRect) {
    scene.healthRect = scene.add.rectangle(x, y, healthBarSize, healthBarHeight, 0xff0000);
  }
  scene.healthRect.width = healthBarSize;
}

function drawHealthText(scene: HudScene, player: IPlayer): void {
  const text = `${player.health.current}/${player.health.maximum}`;
  if (scene.healthText) {
    scene.healthText.setText(text);
    return;
  }
  scene.healthText = scene.add.text(x+xTextOffset, y+yTextOffset, text, { fontSize: "12px" });
}

function drawHealth(scene: HudScene, player: IPlayer): void {
  drawHealthBar(scene, player);
  drawHealthText(scene, player);
}

export { drawHealth }