import * as assert from 'assert';
import Game from '../../src/server/game';
import Player from '../../src/server/player';

describe('Game', function() {
  let game: Game;
  const defaultName = "DEFAULT_NAME";
  const defaultHeroID = 1;
  const id = "id";

  beforeEach(function(){
    game = Game.createTest();
  });

  describe('#AddandRemovePlayers', function() {
    it('Game can add and remove players', function() {
      Player.create(game, id, null, defaultName, defaultHeroID);
      assert.equal(1, game.players.size);
      game.removePlayer(id);
      assert.equal(0, game.players.size);
    });
  });
});
