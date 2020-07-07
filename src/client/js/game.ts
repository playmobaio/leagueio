import { IPlayer, IGameState, IProjectile, Layer, HeroID } from "../../models/interfaces";
import CGameMap from './cgameMap';
import Camera from './camera';
import { drawPlayer } from './draw/player';
import { drawProjectile } from './draw/projectile';
import { drawClientStocks } from './draw/stocks';
import { drawClientHud } from './draw/hud';
import UserInputController from './userInputController';
import drawHeroState from './draw/heroState';
import 'phaser';

class Demo extends Phaser.Scene
{
  constructor()
  {
    super('demo');
  }

  preload(): void
  {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('libs', 'assets/libs.png');
    this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
    this.load.glsl('stars', 'assets/starfields.glsl.js');
  }

  create(): void
  {
    this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

    this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

    this.add.image(400, 300, 'libs');

    const logo = this.add.image(400, 70, 'logo');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
}

// Client
class Game {
  private static instance: Game;
  gameMap: CGameMap;
  camera: Camera;
  currentFrame: number;
  casting: Map<string, number>;
  heroId: HeroID;

  constructor(gameMap: CGameMap, camera: Camera) {
    this.gameMap = gameMap;
    this.camera = camera;
    this.currentFrame = -1;
    this.casting = new Map<string, number>();
  }

  static getInstance(): Game {
    if(Game.instance == null) {
      const gameMap: CGameMap = CGameMap.getInstance();
      const camera = new Camera(gameMap, gameMap.canvas.width, gameMap.canvas.height);
      const game = new Game(gameMap, camera);
      Game.instance = game;
      const config = {
        type: Phaser.AUTO,
        backgroundColor: '#125555',
        width: 800,
        height: 600,
        scene: Demo
      };
      new Phaser.Game(config);
    }
    return Game.instance;
  }

  getCoolDownLeft(abilityName: string): number {
    const lastFrame: number = this.casting.get(abilityName);
    if (lastFrame == null) {
      return 0;
    }
    const secondsLeft = Math.ceil((lastFrame - this.currentFrame) / 60);
    return secondsLeft;
  }

  draw(gameState: IGameState): void {
    if(this.currentFrame >= gameState.currentFrame) {
      return;
    }

    this.currentFrame = gameState.currentFrame;
    this.gameMap.resetFrame();
    this.gameMap.context.fillStyle = "black";
    this.camera.setFrameReference(gameState.client);
    this.gameMap.drawLayer(this.camera, Layer.Background);

    UserInputController.getInstance(null).drawTargetPosition(this);
    gameState.players.forEach((iPlayer: IPlayer): void => {
      drawPlayer(this.gameMap, iPlayer, this.camera);
    });

    gameState.projectiles.forEach((iProjectile: IProjectile): void => {
      drawProjectile(this.gameMap, iProjectile, this.camera);
    });
    drawHeroState(this.gameMap, this.camera, gameState);

    this.gameMap.drawLayer(this.camera, Layer.Foreground);
    drawClientHud(this.gameMap, gameState.client);
    drawClientStocks(this.gameMap, gameState.client)
  }
}

export default Game;
