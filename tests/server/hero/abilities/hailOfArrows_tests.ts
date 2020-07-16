import * as TypeMoq from "typemoq";
import Hero from '../../../../src/server/hero/hero';
import HailOfArrows from "../../../../src/server/hero/abilities/hailOfArrows";
import Game from "../../../../src/server/models/game";

describe('HailOfArrows', function() {
  let hailOfArrows: HailOfArrows;
  let hero: TypeMoq.IMock<Hero>;
  let game: Game;

  beforeEach(function() {
    hero = TypeMoq.Mock.ofType<Hero>();
    hailOfArrows = new HailOfArrows(hero.object);
    game = Game.getInstance();
    game.reset();
  });

  it('smoke', function() {
    hailOfArrows.onCast();
  });

  //  it('User in area of effect will be damaged', function() {
  //    const player = new Player("test", null, "name", 1);
  //    game.players.set("test", player);
  //    const health = player.health.current;
  //    hailOfArrows.targetPosition = new Point(
  //      player.hero.model.origin.x + 25,
  //      player.hero.model.origin.y
  //    );
  //    hailOfArrows.onCast();
  //    assert.equal(health - 15, player.health.current);
  //  });
});
