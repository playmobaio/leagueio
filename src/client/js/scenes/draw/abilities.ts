import HudScene from "../hudScene";
import constants from '../../constants';
import { HeroAbilities } from '../../../../models/data/heroAbilities';
import { AbilityKeys } from '../../../../models/data/abilityKeys';
import PhaserInputController from '../../phaserInputController';

const abilityButtonWidth = 40;
const buttonPadding = 10;
const black = 0x000;
const white = 0xFFF;
const flashYellow = 0xFBEC9C;
const ghostBlue = 0x74A5ED;
const fromBottomOfScreen = 50;
const canvasWidth = constants.DEFAULT_MAP_VIEW_WIDTH;
const canvasHeight = constants.DEFAULT_MAP_VIEW_HEIGHT;

const abilityNameToColor: Record<string, number> = {
  "Ghost": ghostBlue,
  "Flash": flashYellow,
}

const defaultAbilityColor = white;

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

    const abilityBackgroundColor = abilityNameToColor[abilityName] ?
      abilityNameToColor[abilityName] :
      defaultAbilityColor;
    const x = buttonAreaXOffset + buttonIdx * (abilityButtonWidth + buttonPadding);
    const y = canvasHeight - fromBottomOfScreen;

    const cooldownLeft: number = scene.getCoolDownLeft(abilityName, frame);
    const cooldownLabelText = Math.floor(cooldownLeft).toString();

    // Create containers if they don't exist
    let abilityBackground: Phaser.GameObjects.Rectangle;
    let abilityNameLabel: Phaser.GameObjects.Text;
    let cooldownOverlay: Phaser.GameObjects.Rectangle;
    let cooldownLabel: Phaser.GameObjects.Text;
    let abilityKeyLabel: Phaser.GameObjects.Text;
    if (scene.abilities.length != numButtons) {
      abilityBackground = scene.add.rectangle(
        0,
        0,
        abilityButtonWidth,
        abilityButtonWidth,
        abilityBackgroundColor);

      abilityNameLabel = scene.add.text(
        0,
        0,
        abilityName,
        { font: "10px Arial", color: '#000' });
      abilityNameLabel.setPadding(0, 0, 0, 0);
      abilityNameLabel.setOrigin(0.5);

      cooldownOverlay = scene.add.rectangle(
        0,
        0,
        abilityButtonWidth,
        abilityButtonWidth,
        black,
        0.7);

      cooldownLabel = scene.add.text(
        0,
        0,
        cooldownLabelText,
        { font: "10px Arial", color: '#FFF' });
      cooldownLabel.setPadding(0, 0, 0, 0);
      cooldownLabel.setOrigin(0.5);

      abilityKeyLabel = scene.add.text(
        -7,
        7,
        abilityKey.letter,
        { font: "10px Arial", color: '#333' });
      abilityKeyLabel.setPadding(0, 0, 0, 0);
      abilityKeyLabel.setOrigin(1, 0);

      const container = scene.add.container(
        x,
        y,
        [abilityBackground, abilityNameLabel, cooldownOverlay, cooldownLabel, abilityKeyLabel]);
      container.setSize(abilityButtonWidth, abilityButtonWidth);
      scene.abilities.push(container);
    } else {
      // Update existing labels and colors
      abilityBackground = scene.abilities[buttonIdx].list[0] as Phaser.GameObjects.Rectangle;
      abilityNameLabel = scene.abilities[buttonIdx].list[1] as Phaser.GameObjects.Text;
      cooldownOverlay = scene.abilities[buttonIdx].list[2] as Phaser.GameObjects.Rectangle;
      cooldownLabel = scene.abilities[buttonIdx].list[3] as Phaser.GameObjects.Text;
      abilityKeyLabel = scene.abilities[buttonIdx].list[4] as Phaser.GameObjects.Text;

      const showCooldown = cooldownLeft > 0;
      abilityNameLabel.setText(showCooldown ? "" : abilityName);
      cooldownOverlay.setVisible(showCooldown);
      cooldownLabel.setText(showCooldown ? cooldownLabelText : "");
    }
    buttonIdx++;
  }
}

export default drawAbilityButtons;