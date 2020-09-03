import 'phaser';
import PhaserInputController from '../phaserInputController';
import { drawHealth } from './draw/health';
import { drawGameTime } from './draw/gameTime';
import drawAbilityButtons from './draw/abilities';
import { ICasting } from '../../../models/interfaces/iAbility';
import { IGameState } from '../../../models/interfaces/iGameState';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  stockText: Phaser.GameObjects.Text;
  healthBar: Phaser.GameObjects.Rectangle;
  healthText: Phaser.GameObjects.Text;
  gameTimeText: Phaser.GameObjects.Text;
  abilities: Phaser.GameObjects.Container[];
  casting: Map<string, number>;
  score: number;

  constructor()
  {
    super({
      key: "HudScene",
      active: true
    });
    this.abilities = [];
    this.casting = new Map<string, number>();
  }

  create(): void
  {
    const inputController = PhaserInputController.getInstance();
    this.socket = inputController.socket;
    // Register socket event to bind to render function
    this.socket.on("S:UPDATE_GAME_STATE", this.render.bind(this));
    this.socket.on("S:CASTING", (casting: ICasting) => {
      this.casting.set(casting.abilityName, casting.coolDownLastFrame);
    });
    this.socket.on("S:END_GAME", () => {
      this.socket.disconnect(true);
      this.cameras.main.fadeOut(20000, 255, 255, 255);
      document.getElementById("final-score").innerText = this.score.toString();
      document.getElementById("end-menu").setAttribute("style", "display:block");
    });
  }

  getCoolDownLeft(abilityName: string, frame: number): number {
    const lastFrame: number = this.casting.get(abilityName);
    if (lastFrame == null) {
      return 0;
    }
    const secondsLeft = Math.ceil((lastFrame - frame) / 60);
    return secondsLeft;
  }

  render(userGame: IGameState): void {
    this.score = userGame.currentFrame;
    drawHealth(this, userGame.client);
    drawGameTime(this, userGame.currentFrame);
    drawAbilityButtons(this, userGame.currentFrame);
  }
}
export default HudScene;
