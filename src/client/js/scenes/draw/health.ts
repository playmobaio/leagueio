import { IPlayer } from "../../../../models/interfaces/iGameState";
import HudScene from "../hudScene";
import constants from '../../constants';

const x = constants.DEFAULT_MAP_VIEW_WIDTH/2;
const y = constants.DEFAULT_MAP_VIEW_HEIGHT;

const yTextOffset = -17.5;

const healthBarWidthMultiplier = 8;

const healthBarHeight = 15;

function drawHealthBar(scene: HudScene, player: IPlayer): void {
  let healthBarSize: number = Math.ceil(
    player.health.current / player.health.maximum
    * constants.HEALTH_BAR_LENGTH * healthBarWidthMultiplier
  );
  healthBarSize = Math.max(healthBarSize, 0);

  if(!scene.healthBar) {
    scene.healthBar = scene.add.rectangle(
      x,
      y + yTextOffset,
      healthBarSize,
      healthBarHeight,
      0xff0000);
  }
  scene.healthBar.width = healthBarSize;
}

function drawHealthText(scene: HudScene, player: IPlayer): void {
  const text = `${player.health.current}/${player.health.maximum}`;
  if (scene.healthText) {
    scene.healthText.setText(text);
    return;
  }
  scene.healthText = scene.add.text(
    x - player.health.maximum/4,
    y+yTextOffset - healthBarHeight/2,
    text,
    { fontSize: "12px" });
}

function drawHealth(scene: HudScene, player: IPlayer): void {
  drawHealthBar(scene, player);
  drawHealthText(scene, player);
}

export { drawHealth }
