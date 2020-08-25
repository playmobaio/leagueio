import HudScene from "../hudScene";
import constants from '../../constants';
import { HeroAbilities } from '../../../../models/data/heroAbilities';
import { IAbilityKey, AbilityKeys } from '../../../../models/data/abilityKeys';
import PhaserInputController from '../../phaserInputController';

const abilityButtonWidth = 40;
const gapBetweenButtons = 10;
const halfButtonArea = 1.5 * abilityButtonWidth;
const gray = 0x808080;
const white = 0xFFFFFF;
const black = 0;

function drawAbilityButtons(scene: HudScene, frame: number): void {
  const canvasWidth = constants.DEFAULT_MAP_VIEW_WIDTH;
  const canvasHeight = constants.DEFAULT_MAP_VIEW_HEIGHT;
  const heroId = PhaserInputController.getInstance().heroId;
  const buttonAreaXOffset = canvasWidth / 2 - halfButtonArea + gapBetweenButtons;
  for (let i = 0; i < 3; i++) {
    const x = buttonAreaXOffset + i * (abilityButtonWidth + gapBetweenButtons);
    const y = canvasHeight - 50;
    const abilityKey: IAbilityKey = AbilityKeys[i];
    const abilityName: string = HeroAbilities[heroId][abilityKey.key]?.abilityName;
    let text: string;
    let colorFill = black;
    // If ability no ability gray out
    if (abilityName == null) {
      colorFill = gray;
      text = abilityKey.letter;
    } else {
      const coolDownLeft: number = scene.getCoolDownLeft(abilityName, frame);
      // If there is no cooldown show letter with white o/w grayed out
      if (coolDownLeft <= 0) {
        colorFill = white;
        text = abilityKey.letter
      } else {
        colorFill = gray;
        text = Math.floor(coolDownLeft).toString();
      }
    }

    // Create containers if they don't exist
    if (scene.abilities.length != 3) {
      const rectangle = scene.add.rectangle(
        0,
        0,
        abilityButtonWidth,
        abilityButtonWidth,
        colorFill);
      const label = scene.add.text(0, 0, text, { fontSize: "20px", color: '#000' });
      // center text in container
      label.setOrigin(0.5);

      const container = scene.add.container(x, y, [rectangle, label]);
      scene.abilities.push(container);
    } else {
      // Update existing labels and colors
      (scene.abilities[i].first as Phaser.GameObjects.Rectangle).setFillStyle(colorFill);
      const label = scene.abilities[i].last as Phaser.GameObjects.Text;
      label.setText(text);
      label.setOrigin(0.5);
    }
  }
}

export default drawAbilityButtons;