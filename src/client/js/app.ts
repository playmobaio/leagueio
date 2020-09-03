import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces/iJoinGame";
import 'phaser';
import GameScene from './scenes/gameScene';
import PhaserInputController from './phaserInputController';
import HudScene from './scenes/hudScene';
import constants from './constants';
import { CreateScoreEntries } from './scores';
import { IScore } from '../../server/models/iScore';

let phaserGame:  Phaser.Game;
function InitializePhaserUI(fullScreen: boolean): void {
  document.getElementById('main-menu').setAttribute("style", "display:none;");
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
    document.getElementsByTagName("body")[0].requestFullscreen();
  }
}

function InitializeSocket(server: string): void {
  console.log("Initializing Socket");
  const socket: SocketIO.Socket = io(server);
  const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
  const heroId: HeroID = HeroID.Dodge;
  const joinGame: IJoinGame = { name, heroId };
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

async function startGame(): Promise<void> {
  const fullScreen: boolean = (document.getElementById("fullScreen") as HTMLInputElement).checked;
  const server = await GetGameServer();
  if (server && IsPublicUrl(server)) {
    InitializeSocket(server);
    InitializePhaserUI(fullScreen);
  }
}

document.getElementById("join-game").onclick = startGame;

document.getElementById("return-main-menu").onclick = (): void => {
  phaserGame.destroy(true);
  phaserGame.events.once("destroy", () => {
    document.getElementById("end-menu").removeAttribute("style");
    document.getElementById("main-menu").removeAttribute("style");
  });
}

document.getElementById("play-again").onclick = (): void => {
  phaserGame.destroy(true);
  document.getElementById("end-menu").removeAttribute("style");
  phaserGame.events.once("destroy", startGame);
}

// Load Scores
fetch("/scores").then(async response => {
  if (response.ok) {
    const scores = await response.json() as IScore[];
    const entriesDiv = document.getElementById("entries") as HTMLElement;
    const entries = CreateScoreEntries(scores);
    entriesDiv.replaceWith(entries);
  } else {
    alert("Could not load scores at this time");
  }
});

// If JS is not yet loaded button will have spinner
document.getElementById("gamespinner").outerHTML = "Join Game";
