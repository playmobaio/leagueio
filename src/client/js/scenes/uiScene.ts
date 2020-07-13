import 'phaser';

class UIScene extends Phaser.Scene {
  score: number;

  constructor()
  {
    super({ key: 'UIScene', active: true });
    this.score = 0;
  }

  create(): void
  {
    //  Our Text object to display the Score
    const info = this.add.text(10, 10, 'Score: 0', { font: '24px Arial', fill: '#000000' });

    //  Grab a reference to the Game Scene
    const ourGame = this.scene.get('GameScene');

    //  Listen for events from it
    ourGame.events.on('addScore', function() {
      this.score += 10;
      info.setText('Score: ' + this.score);
    }, this);
  }
}
export default UIScene;