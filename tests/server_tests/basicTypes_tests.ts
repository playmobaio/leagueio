import * as assert from 'assert';
import { Velocity, Point, Rectangle } from '../../src/server/models/basicTypes';
import { UserIO } from '../../src/models/interfaces';
import constants from '../../src/server/constants';

describe('Velocity', function() {
  let velocity: Velocity;
  beforeEach(function(){
    velocity = new Velocity(3, 4);
  });

  describe('#GetsCorrectSpeed', function() {
    it('Velocity should be 5', function(){
      assert.equal(5, velocity.getSpeed());
    });
  });

  describe('#GetVelocityFromUserIO', function() {
    it('Velocity should match userIO', function() {
      velocity =  Velocity.getVelocity(UserIO.left);
      assert.equal(-constants.DEFAULT_VELOCITY, velocity.x);

      velocity =  Velocity.getVelocity(UserIO.right);
      assert.equal(constants.DEFAULT_VELOCITY, velocity.x);

      velocity =  Velocity.getVelocity(UserIO.up);
      assert.equal(-constants.DEFAULT_VELOCITY, velocity.y);

      velocity =  Velocity.getVelocity(UserIO.down);
      assert.equal(constants.DEFAULT_VELOCITY, velocity.y);

      velocity =  Velocity.getVelocity(UserIO.right | UserIO.up);
      assert.equal(constants.DEFAULT_VELOCITY, velocity.x);
      assert.equal(-constants.DEFAULT_VELOCITY, velocity.y);
    })
  });

  describe('#GetUnitVector', function() {
    it('Validating unit vector', function() {
      const src = new Point(0, 0);
      const dest = new Point(3, 4);
      const velocity = Velocity.getUnitVector(src, dest);
      assert.equal(0.6, velocity.x);
      assert.equal(0.8, velocity.y);
    });
  });
});

describe('Point', function() {
  let velocity: Velocity;
  let point: Point;
  beforeEach(function(){
    velocity = new Velocity(1, 1);
    point = new Point(0, 0);
  });

  describe('#TransformValid', function() {
    it('Point should be found at 1,1', function(){
      const retPoint = point.transform(velocity);
      assert.equal(1, retPoint.x);
      assert.equal(1, retPoint.y);
    });

    it('Point should be found at 10,10', function(){
      const retPoint = point.transform(velocity, 10);
      assert.equal(10, retPoint.x);
      assert.equal(10, retPoint.y);
    });
  });
});

describe('Rectangle', function() {
  let rectangle: Rectangle;
  beforeEach(function() {
    rectangle = new Rectangle(new Point(0, 0), 1, 5, 10);
  });

  describe('#CheckCollisions', function() {
    it('CheckCollisions', function(){
      // inside
      let testRectangle = new Rectangle(new Point(3, 3), 1, 1);
      assert.throws(() => rectangle.isCollision(testRectangle));
      // top
      testRectangle = testRectangle.transform(new Velocity(-3, 0));
      assert.throws(() => rectangle.isCollision(testRectangle));
      // top left
      // left
      // bottom left
      // bottom
      // bottom right
      // right
      // top right
      // outside
    });
  });
});