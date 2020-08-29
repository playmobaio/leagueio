import HudScene from "../hudScene";
import constants from '../../constants';
import { HeroAbilities } from '../../../../models/data/heroAbilities';
import { IAbilityKey, AbilityKeys } from '../../../../models/data/abilityKeys';
import PhaserInputController from '../../phaserInputController';

const abilityButtonWidth = 40;
const buttonPadding = 10;
const buttonArea = 3 * abilityButtonWidth;
const gray = 0x808080;
const white = 0xFFFFFF;
const fromBottomOfScreen = 50;
const canvasWidth = constants.DEFAULT_MAP_VIEW_WIDTH;
const canvasHeight = constants.DEFAULT_MAP_VIEW_HEIGHT;
const buttonAreaXOffset = canvasWidth / 2 - buttonArea / 2 + buttonPadding;

function drawAbilityButtons(scene: HudScene, frame: number): void {
  const heroId = PhaserInputController.getInstance().heroId;
  for (let i = 0; i < 3; i++) {
    const x = buttonAreaXOffset + i * (abilityButtonWidth + buttonPadding);
    const y = canvasHeight - fromBottomOfScreen;
    const abilityKey: IAbilityKey = AbilityKeys[i];
    const abilityName: string = HeroAbilities[heroId][abilityKey.key]?.abilityName;
    const coolDownLeft: number = scene.getCoolDownLeft(abilityName, frame);
    const colorFill = abilityName == null || coolDownLeft > 0 ? gray : white;
    const text = coolDownLeft > 0 ? Math.floor(coolDownLeft).toString() : abilityKey.letter;

    // Create containers if they don't exist
    let label: Phaser.GameObjects.Text;
    if (scene.abilities.length != 3) {
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
      (scene.abilities[i].first as Phaser.GameObjects.Rectangle).setFillStyle(colorFill);
      label = scene.abilities[i].last as Phaser.GameObjects.Text;
      label.setText(text);
    }
    // center text in container
    label.setOrigin(0.5);
  }
}

export default drawAbilityButtons;