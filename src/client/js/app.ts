import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces";
import { registerSocket } from './socket';
import Layers from './layer';
import Game from './game';

import 'phaser';
import GameScene from './scenes/gameScene';
import UIScene from './scenes/uiScene';

function resizeCanvas(): void {
  const canvas: HTMLElement = document.getElementById("canvas");
  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}

function InitializeGameUI(fullScreen: boolean): void {
  document.getElementsByTagName("body")[0].style.margin = "0px 0px 0px 0px";
  document.getElementById("startpanel").style.visibility = "hidden";
  document.getElementById("startpanel").style.height = "0px";
  document.getElementById("game").style.visibility = "visible";
  if (fullScreen) {
    document.getElementById("game").requestFullscreen();
  }
  resizeCanvas();
}

function InitializePhaserUI(fullScreen: boolean): void {
  document.getElementById('startpanel').setAttribute("style", "display:none;");
  document.getElementById('game').setAttribute("style", "display:none;");
  const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#89CFF0',
    scene: [ GameScene, UIScene ]
  };
  const game = new Phaser.Game(config);
  if (fullScreen) {
    game.scale.startFullscreen();
  }
}

function InitializeSocket(): void {
  console.log("Initializing Socket");
  const socket: SocketIO.Socket = io();
  const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
  const heroId: HeroID = parseInt((document.getElementById("hero") as HTMLInputElement).value);
  const joinGame: IJoinGame = { name, heroId };
  registerSocket(socket);
  socket.emit("C:JOIN_GAME", joinGame);
  Game.getInstance().heroId = heroId;
}

document.getElementById("joinGame").onclick = (): void => {
  const usePhaser: boolean = (document.getElementById("usePhaser") as HTMLInputElement).checked;
  const fullScreen: boolean = (document.getElementById("fullScreen") as HTMLInputElement).checked;
  if (!usePhaser && Layers.getLayers() == undefined) {
    alert("Loading assets. Please try again");
    return;
  }
  InitializeSocket();
  if(usePhaser) {
    InitializePhaserUI(fullScreen);
  }
  else {
    InitializeGameUI(fullScreen);
    window.addEventListener('resize', resizeCanvas);
  }
};

Layers.createAsync();
