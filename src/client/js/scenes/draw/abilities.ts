import HudScene from "../hudScene";
import constants from '../../constants';
import { HeroAbilities } from '../../../../models/data/heroAbilities';
import { AbilityKeys } from '../../../../models/data/abilityKeys';
import PhaserInputController from '../../phaserInputController';

const abilityButtonWidth = 40;
const buttonPadding = 10;
const gray = 0x808080;
const white = 0xFFFFFF;
const fromBottomOfScreen = 50;
const canvasWidth = constants.DEFAULT_MAP_VIEW_WIDTH;
const canvasHeight = constants.DEFAULT_MAP_VIEW_HEIGHT;

function getActiveAbilities(heroId: number): number {
  let total = 0;
  for (const key of AbilityKeys) {
    if (HeroAbilities[heroId][key.key] != null) {
      total++;
    }
  }
  return total;
}

function drawAbilityButtons(scene: HudScene, frame: number): void {
  const heroId = PhaserInputController.getInstance().heroId;
  const numButtons = getActiveAbilities(heroId);
  const buttonArea = numButtons * abilityButtonWidth;
  const gapArea = (numButtons - 1) * buttonPadding;
  const buttonAreaXOffset = (canvasWidth - buttonArea)/ 2 + gapArea;
  let buttonIdx = 0;
  for (const abilityKey of AbilityKeys) {
    const abilityName: string = HeroAbilities[heroId][abilityKey.key]?.abilityName;
    if (abilityName == null) {
      continue;
    }
    const x = buttonAreaXOffset + buttonIdx * (abilityButtonWidth + buttonPadding);
    const y = canvasHeight - fromBottomOfScreen;

    const coolDownLeft: number = scene.getCoolDownLeft(abilityName, frame);
    const colorFill = coolDownLeft > 0 ? gray : white;
    const text = coolDownLeft > 0 ? Math.floor(coolDownLeft).toString() : abilityKey.letter;

    // Create containers if they don't exist
    let label: Phaser.GameObjects.Text;
    if (scene.abilities.length != numButtons) {
      const rectangle = scene.add.rectangle(
        0,
        0,
        abilityButtonWidth,
        abilityButtonWidth,
        colorFill);
      label = scene.add.text(0, 0, text, { font: "20px Arial", color: '#000' });
      const container = scene.add.container(x, y, [rectangle, label]);
      scene.abilities.push(container);
    } else {
      // Update existing labels and colors
      (scene.abilities[buttonIdx].first as Phaser.GameObjects.Rectangle).setFillStyle(colorFill);
      label = scene.abilities[buttonIdx].last as Phaser.GameObjects.Text;
      label.setText(text);
    }
    // center text in container
    label.setOrigin(0.5);
    buttonIdx++;
  }
}

export default drawAbilityButtons;