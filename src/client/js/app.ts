import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces";
import 'phaser';
import GameScene from './scenes/gameScene';
import PhaserInputController from './phaserInputController';
import HudScene from './scenes/hudScene';

let phaserGame:  Phaser.Game;
function InitializePhaserUI(fullScreen: boolean): void {
  document.getElementById('startpanel').setAttribute("style", "display:none;");
  document.getElementById('game').setAttribute("style", "display:none;");
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [ GameScene, HudScene ]
  };
  phaserGame = new Phaser.Game(config);
  if (fullScreen) {
    phaserGame.scale.startFullscreen();
  }
}

function InitializeSocket(): void {
  console.log("Initializing Socket");
  const socket: SocketIO.Socket = io();
  const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
  const heroId: HeroID = parseInt((document.getElementById("hero") as HTMLInputElement).value);
  const joinGame: IJoinGame = { name, heroId };
  socket.on("S:END_GAME", () => {
    phaserGame.destroy(true);
    socket.disconnect(true);
    document.getElementById('startpanel').setAttribute("style", "display:initial;");
  });
  PhaserInputController.createInstance(socket);
  socket.emit("C:JOIN_GAME", joinGame);
}

document.getElementById("joinGame").onclick = (): void => {
  const fullScreen: boolean = (document.getElementById("fullScreen") as HTMLInputElement).checked;
  InitializeSocket();
  InitializePhaserUI(fullScreen);
};
