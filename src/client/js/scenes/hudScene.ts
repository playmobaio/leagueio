import 'phaser';
import PhaserInputController from '../phaserInputController';
import { drawHealth } from './draw/health';
import { drawGameTime } from './draw/gameTime';
import drawAbilityButtons from './draw/abilities';
import { ICasting } from '../../../models/interfaces/iAbility';
import { IGameState } from '../../../models/interfaces/iGameState';
import * as mixpanel from 'mixpanel-browser';
import MixpanelEvents from '../mixpanelEvents'
import drawLatency from './draw/latency';

class HudScene extends Phaser.Scene {
  socket: SocketIO.Socket;
  stockText: Phaser.GameObjects.Text;
  healthBar: Phaser.GameObjects.Rectangle;
  healthText: Phaser.GameObjects.Text;
  gameTimeText: Phaser.GameObjects.Text;
  latencyText: Phaser.GameObjects.Text;
  abilities: Phaser.GameObjects.Container[];
  casting: Map<string, number>;
  gameState: IGameState;
  pingStartTime: number;
  latency: number;

  constructor()
  {
    super({
      key: "HudScene",
      active: true
    });
    this.abilities = [];
    this.casting = new Map<string, number>();
    this.pingStartTime = Date.now();
  }

  create(): void
  {
    const inputController = PhaserInputController.getInstance();
    this.socket = inputController.socket;
    // Register socket event to bind to render function
    this.socket.on("S:UPDATE_GAME_STATE", this.setGameState.bind(this));
    this.socket.on("S:CASTING", (casting: ICasting) => {
      this.casting.set(casting.abilityName, casting.coolDownLastFrame);
    });
    this.socket.on("S:END_GAME", () => {
      mixpanel.track(MixpanelEvents.FINISH_GAME, { score: this.gameState.currentFrame });
      this.socket.disconnect(true);
      this.cameras.main.fadeOut(20000, 255, 255, 255);
      document.getElementById("final-score").innerText = this.gameState.currentFrame.toString();
      document.getElementById("end-menu").setAttribute("style", "display:block");
    });
    setInterval(() => {
      this.socket.emit("C:PING");
      this.pingStartTime = Date.now();
    }, 1000);
    this.socket.on("S:PONG", () => {
      this.latency = Date.now() - this.pingStartTime;
    })
  }

  render(userGame: IGameState): void {
    if (userGame == null) {
      return;
    }
    drawHealth(this, userGame.client);
    drawGameTime(this, userGame.currentFrame);
    drawAbilityButtons(this, userGame.currentFrame);
    drawLatency(this);
  }

  getCoolDownLeft(abilityName: string, frame: number): number {
    const lastFrame: number = this.casting.get(abilityName);
    if (lastFrame == null) {
      return 0;
    }
    const secondsLeft = Math.ceil((lastFrame - frame) / 60);
    return secondsLeft;
  }

  setGameState(gameState: IGameState): void {
    this.gameState = gameState;
  }

  update(): void {
    this.render(this.gameState);
  }
}
export default HudScene;
