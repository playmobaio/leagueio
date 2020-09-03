import * as TypeMoq from "typemoq";
import Hero from '../../../../src/server/hero/hero';
import HailOfArrows from "../../../../src/server/hero/abilities/hailOfArrows";

describe('HailOfArrows', function() {
  let hailOfArrows: HailOfArrows;
  let hero: TypeMoq.IMock<Hero>;

  beforeEach(function() {
    hero = TypeMoq.Mock.ofType<Hero>();
    hailOfArrows = new HailOfArrows(hero.object);
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
