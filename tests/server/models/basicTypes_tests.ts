import * as assert from 'assert';
import { Velocity, Point, Vector } from '../../../src/server/models/basicTypes';
import { PlayerMovementIO } from '../../../src/models/interfaces';
import constants from '../../../src/server/constants';

describe('Velocity', function() {
  describe('#VelocityTests', function() {
    it('Construct Velocity with just dest and speed', function() {
      const velocity: Velocity = new Velocity({ x: 3, y: 4 }, 1);
      assert.equal(1, velocity.getSpeed());
      const unitVector: Vector = velocity.getUnitVector();
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: Vector = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Construct Velocity with all inputs', function() {
      const velocity: Velocity = new Velocity({ x: 4, y: 5 }, 1, { x: 1, y: 1 });
      assert.equal(1, velocity.getSpeed());
      const unitVector: Vector = velocity.getUnitVector();
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: Vector = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Unit vector of 0,0 is valid', function() {
      const velocity = new Velocity(new Point(0, 0), 0);
      assert.equal(0, velocity.getSpeed());
      const vector: Vector = velocity.getUnitVector();
      assert.equal(0, vector.x);
      assert.equal(0, vector.y);
    });

    it('Validate PlayerMovementIO', function() {
      const validPlayerMovementIO = (io: PlayerMovementIO, expectedX, expectedY): void => {
        const velocity =  Velocity.getPlayerVelocity(io);
        const unitVector: Vector = velocity.getUnitVector();
        assert.equal(constants.DEFAULT_PLAYER_VELOCITY, velocity.getSpeed());
        assert.equal(expectedX, unitVector.x);
        assert.equal(expectedY, unitVector.y);
      }

      validPlayerMovementIO(PlayerMovementIO.left, -1, 0);
      validPlayerMovementIO(PlayerMovementIO.right, 1, 0);
      validPlayerMovementIO(PlayerMovementIO.up, 0, -1);
      validPlayerMovementIO(PlayerMovementIO.down, 0, 1);
    })
  });
});

describe('Point', function() {
  let velocity: Velocity;
  let point: Point;

  beforeEach(function() {
    velocity = new Velocity(new Point(3, 4), 1);
    point = new Point(0, 0);
  });

  describe('#Transform', function() {
    it('Smoke testing point transformation', function() {
      const retPoint = point.transform(velocity);
      assert.equal(0.6, retPoint.x);
      assert.equal(0.8, retPoint.y);
    });

    it('Point correctly transform with velocity magnitude(speed)', function() {
      velocity.setSpeed(10);
      const retPoint = point.transform(velocity);
      assert.equal(6, retPoint.x);
      assert.equal(8, retPoint.y);
    });

    it('Point correctly transform with vector', function() {
      const vector = new Vector(10, 1);
      const retPoint = point.transformWithVector(vector);
      assert.equal(10, retPoint.x);
      assert.equal(1, retPoint.y);
    });
  });
});

describe('Vector', function() {
  let vector: Vector;

  beforeEach(function() {
    vector = new Vector(3, 4);
  });

  it('getUnitVector returns correct unit vector', function() {
    const unitVector: Vector = vector.getUnitVector();

    assert.equal(3/5, unitVector.x);
    assert.equal(4/5, unitVector.y);
  });

  it('getUnitVector of a null vector is a null vector', function() {
    const nullVector = new Vector(0, 0);
    const unitVector: Vector = nullVector.getUnitVector();

    assert.equal(0, unitVector.x);
    assert.equal(0, unitVector.y);
  });
});
