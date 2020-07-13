import 'phaser';

class GameScene extends Phaser.Scene {
  constructor()
  {
    super('GameScene');
  }

  preload(): void
  {
    this.load.spritesheet('tiles', '../../assets/tiles.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create(): void
  {
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;
    for (let i = 0; i < 64; i++)
    {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);

      this.add.image(x, y, 'tiles').setInteractive();
    }
    this.input.on('gameobjectup', this.clickHandler, this);
  }

  clickHandler(_, box): void
  {
    //  Disable our box
    box.input.enabled = false;
    box.setVisible(false);

    //  Dispatch a Scene event
    this.events.emit('addScore');
  }
}
export default GameScene;