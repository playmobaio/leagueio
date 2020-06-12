import CGameMap from "../cgameMap";
import { IPlayer, IAbility } from '../../../models/interfaces';
import constants from '../constants';

const abilityButtonWidth = 40;
const gapBetweenButtons = 10;
const buttonAreaWidth = abilityButtonWidth * 3 + gapBetweenButtons * 2;

function drawAbilityButtons(gameMap: CGameMap, clientPlayer: IPlayer): void {
  const canvasWidth = gameMap.canvas.width;
  const canvasHeight = gameMap.canvas.height;
  gameMap.context.fillStyle = "white";
  const buttonAreaXOffset = (canvasWidth - buttonAreaWidth) / 2;
  for (let i = 0; i < 3; i++) {
    const x = buttonAreaXOffset + i * (abilityButtonWidth + gapBetweenButtons);
    const y = canvasHeight - 60;
    const ability: IAbility = clientPlayer.hero[constants.ABILITY_KEYS[i].key];
    let text: string;
    if (ability == null) {
      gameMap.context.fillStyle = "gray";
      text = constants.ABILITY_KEYS[i].letter;
    } else if (ability.cooldownLeft == 0) {
      gameMap.context.fillStyle = "white";
      text = constants.ABILITY_KEYS[i].letter
    } else if (ability.cooldownLeft > 0) {
      gameMap.context.fillStyle = "gray";
      text = Math.floor(ability.cooldownLeft).toString();
    }
    gameMap.context.fillRect(x, y, abilityButtonWidth, abilityButtonWidth);
    const textOffset = (abilityButtonWidth - gameMap.context.measureText(text).width) / 2;
    gameMap.context.font = "20px Arial";
    gameMap.context.fillStyle = "black";
    gameMap.context.fillText(text, x + textOffset, y + 28);
  }
}

function drawPlayerHealthBar(gameMap: CGameMap, clientPlayer: IPlayer): void {
  const canvasWidth = gameMap.canvas.width;
  const canvasHeight = gameMap.canvas.height;
  const buttonAreaXOffset = (canvasWidth - buttonAreaWidth) / 2;
  gameMap.context.fillStyle = "black";
  gameMap.context.fillRect(buttonAreaXOffset, canvasHeight - 20, buttonAreaWidth, 18);
  gameMap.context.fillStyle = "green";
  let healthBarSize: number = Math.ceil(
    clientPlayer.health.current / clientPlayer.health.maximum * buttonAreaWidth);
  healthBarSize = Math.max(healthBarSize, 0);
  gameMap.context.fillRect(buttonAreaXOffset, canvasHeight - 20, healthBarSize, 18);
}

function drawPlayerHealthText(gameMap: CGameMap, clientPlayer: IPlayer): void {
  gameMap.context.fillStyle = "white";
  gameMap.context.font = "15px Arial";
  const canvasWidth = gameMap.canvas.width;
  const canvasHeight = gameMap.canvas.height;
  const buttonAreaXOffset = (canvasWidth - buttonAreaWidth) / 2;

  const healthText = `${clientPlayer.health.current} / ${clientPlayer.health.maximum}`;
  const textOffset = (buttonAreaWidth - gameMap.context.measureText(healthText).width) / 2;
  gameMap.context.fillText(
    `${clientPlayer.health.current} / ${clientPlayer.health.maximum}`,
    buttonAreaXOffset + textOffset, canvasHeight - 5);
}

function drawClientHud(gameMap: CGameMap, clientPlayer: IPlayer): void {
  drawAbilityButtons(gameMap, clientPlayer);
  drawPlayerHealthBar(gameMap, clientPlayer);
  drawPlayerHealthText(gameMap, clientPlayer);
}

export {
  drawClientHud
}