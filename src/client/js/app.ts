import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces/iJoinGame";
import 'phaser';
import GameScene from './scenes/gameScene';
import PhaserInputController from './phaserInputController';
import HudScene from './scenes/hudScene';
import constants from './constants';

let phaserGame:  Phaser.Game;
function InitializePhaserUI(fullScreen: boolean): void {
  document.getElementById('startpanel').setAttribute("style", "display:none;");
  document.getElementById('game').setAttribute("style", "display:none;");
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: constants.DEFAULT_MAP_VIEW_WIDTH,
    height: constants.DEFAULT_MAP_VIEW_HEIGHT,
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
    },
    scene: [ GameScene, HudScene ]
  };
  phaserGame = new Phaser.Game(config);
  if (fullScreen) {
    phaserGame.scale.startFullscreen();
  }
}

function InitializeSocket(server: string): void {
  console.log("Initializing Socket");
  const socket: SocketIO.Socket = io(server);
  const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
  const heroId: HeroID = HeroID.Dodge;
  const joinGame: IJoinGame = { name, heroId };
  socket.on("S:END_GAME", () => {
    phaserGame.destroy(true);
    socket.disconnect(true);
    document.getElementById('startpanel').setAttribute("style", "display:initial;");
  });
  PhaserInputController.createInstance(socket);
  PhaserInputController.getInstance().setHeroId(heroId);
  socket.emit("C:JOIN_GAME", joinGame);
}

async function GetGameServer(): Promise<string> {
  return await fetch("/server").then(async response => {
    if (!response.ok) { throw response }
    return (await response.json()).url;
  }).catch(err => {
    err.text().then(errorMessage => {
      // We should replace this with some better UI
      alert(errorMessage);
    })
  });
}

function IsPublicUrl(server: string): boolean {
  const isPrivate = server.includes("10.240.0");
  if (isPrivate) {
    alert("The requested game server isn't currently available please try again.");
  }
  return !isPrivate;
}

document.getElementById("joinGame").onclick = async(): Promise<void> => {
  const fullScreen: boolean = (document.getElementById("fullScreen") as HTMLInputElement).checked;
  const server = await GetGameServer();
  if (server && IsPublicUrl(server)) {
    InitializeSocket(server);
    InitializePhaserUI(fullScreen);
  }
};
