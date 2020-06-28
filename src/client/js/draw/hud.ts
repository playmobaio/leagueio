import CGameMap from "../cgameMap";
import { IPlayer } from '../../../models/interfaces';
import { AbilityKeys, IAbilityKey } from '../../../models/data/abilityKeys';
import Game from '../game';
import { HeroAbilities } from '../../../models/data/heroAbilities';

const abilityButtonWidth = 40;
const gapBetweenButtons = 10;
const buttonAreaWidth = abilityButtonWidth * 3 + gapBetweenButtons * 2;

function drawAbilityButtons(gameMap: CGameMap): void {
  const canvasWidth = gameMap.canvas.width;
  const canvasHeight = gameMap.canvas.height;
  gameMap.context.fillStyle = "white";
  const buttonAreaXOffset = (canvasWidth - buttonAreaWidth) / 2;
  const game = Game.getInstance();
  for (let i = 0; i < 3; i++) {
    const x = buttonAreaXOffset + i * (abilityButtonWidth + gapBetweenButtons);
    const y = canvasHeight - 60;
    const abilityKey: IAbilityKey = AbilityKeys[i];
    const abilityName: string = HeroAbilities[game.heroId][abilityKey.key]?.abilityName;
    let text: string;
    if (abilityName == null) {
      gameMap.context.fillStyle = "gray";
      text = abilityKey.letter;
    } else {
      const coolDownLeft: number = game.getCoolDownLeft(abilityName);
      if (coolDownLeft <= 0) {
        gameMap.context.fillStyle = "white";
        text = abilityKey.letter
      } else {
        gameMap.context.fillStyle = "gray";
        text = Math.floor(coolDownLeft).toString();
      }
    }
    gameMap.context.fillRect(x, y, abilityButtonWidth, abilityButtonWidth);
    gameMap.context.font = "20px Arial";
    gameMap.context.fillStyle = "black";
    const textOffset = (abilityButtonWidth - gameMap.context.measureText(text).width) / 2;
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
  drawAbilityButtons(gameMap);
  drawPlayerHealthBar(gameMap, clientPlayer);
  drawPlayerHealthText(gameMap, clientPlayer);
}

export {
  drawClientHud
}