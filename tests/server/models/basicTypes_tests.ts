import * as assert from 'assert';
import { Velocity, Point, Rectangle } from '../../../src/server/models/basicTypes';
import { UserIO, IPoint } from '../../../src/models/interfaces';
import constants from '../../../src/server/constants';

describe('Velocity', function() {
  describe('#VelocityTests', function() {
    it('Construct Velocity with just dest and speed', function(){
      const velocity: Velocity = new Velocity({ x: 3, y: 4 }, 1);
      assert.equal(1, velocity.speed);
      const unitVector: IPoint = velocity.getUnitVector();
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: IPoint = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Construct Velocity with all inputs', function(){
      const velocity: Velocity = new Velocity({ x: 4, y: 5 }, 1, { x: 1, y: 1 });
      assert.equal(1, velocity.speed);
      const unitVector: IPoint = velocity.getUnitVector();
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: IPoint = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Unit vector of 0,0 is valid', function() {
      const velocity = new Velocity(new Point(0, 0), 0);
      assert.equal(0, velocity.speed);
      const vector: IPoint = velocity.getUnitVector();
      assert.equal(0, vector.x);
      assert.equal(0, vector.y);
    });

    it('Validate UserIO', function() {
      const validUserIO = (io: UserIO, expectedX, expectedY): void => {
        const velocity =  Velocity.getPlayerVelocity(io);
        const unitVector: IPoint = velocity.getUnitVector();
        assert.equal(constants.DEFAULT_PLAYER_VELOCITY, velocity.speed);
        assert.equal(expectedX, unitVector.x);
        assert.equal(expectedY, unitVector.y);
      }

      validUserIO(UserIO.left, -1, 0);
      validUserIO(UserIO.right, 1, 0);
      validUserIO(UserIO.up, 0, -1);
      validUserIO(UserIO.down, 0, 1);
    })
  });
});

describe('Point', function() {
  let velocity: Velocity;
  let point: Point;
  beforeEach(function(){
    velocity = new Velocity(new Point(3, 4), 1);
    point = new Point(0, 0);
  });

  describe('#TransformValid', function() {
    it('Smoke testing point transformation', function(){
      const retPoint = point.transform(velocity);
      assert.equal(0.6, retPoint.x);
      assert.equal(0.8, retPoint.y);
    });

    it('Point correctly transform with velocity magnitude(speed)', function(){
      velocity.speed = 10;
      const retPoint = point.transform(velocity);
      assert.equal(6, retPoint.x);
      assert.equal(8, retPoint.y);
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
      const testRectangle = new Rectangle(new Point(3, 3), 1, 1);
      assert.throws(() => rectangle.isCollision(testRectangle));
      // top
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