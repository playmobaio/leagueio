import * as io from 'socket.io-client';
import { HeroID, IJoinGame } from "../../models/interfaces";
import { registerSocket } from './socket';
import Layers from './layer';
import Game from './game';

import 'phaser';
import SceneA from '../phaser/scenes/SceneA';
import SceneB from '../phaser/scenes/SceneB';
function resizeCanvas(): void {
  const canvas: HTMLElement = document.getElementById("canvas");
  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}

function InitializeGameUI(): void {
  document.getElementsByTagName("body")[0].style.margin = "0px 0px 0px 0px";
  document.getElementById("startpanel").style.visibility = "hidden";
  document.getElementById("startpanel").style.height = "0px";
  document.getElementById("game").style.visibility = "visible";
  document.getElementById("game").requestFullscreen();
  resizeCanvas();
}

document.getElementById("joinGame").onclick = (): void => {
  const usePhaser: boolean = (document.getElementById("usePhaser") as HTMLInputElement).checked;


  if(usePhaser) {
    document.getElementById('startpanel').setAttribute("style", "display:none;");
    document.getElementById('game').setAttribute("style", "display:none;");
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH },
      backgroundColor: '#ffffff',
      parent: 'phaser-example',
      scene: [ SceneA, SceneB ]
    };
    new Phaser.Game(config);
  }
  else {
    if (Layers.getLayers() == undefined) {
      alert("Loading assets. Please try again");
      return;
    }
    console.log("Initializing Socket");
    const name: string = (document.getElementById("playerName") as HTMLInputElement).value;
    const heroId: HeroID = parseInt((document.getElementById("hero") as HTMLInputElement).value);
    const joinGame: IJoinGame = { name, heroId };
    Game.getInstance().heroId = heroId;

    const socket: SocketIO.Socket = io();
    registerSocket(socket);
    InitializeGameUI();
    window.addEventListener('resize', resizeCanvas);
    socket.emit("C:JOIN_GAME", joinGame);
  }
};

Layers.createAsync();
