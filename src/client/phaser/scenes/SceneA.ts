import 'phaser';

class SceneA extends Phaser.Scene {

  constructor()
  {
    super('GameScene');
  }

  preload(): void
  {
    this.load.image('bg', '../assets/background.png');
    this.load.image('crate', '../assets/crate.png');
  }

  create(): void
  {
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;
    this.add.image(width, height, 'bg');
    for (let i = 0; i < 64; i++)
    {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);

      this.add.image(x, y, 'crate').setInteractive();
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
export default SceneA;