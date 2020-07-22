import * as assert from 'assert';
import { Velocity, Point, Vector } from '../../../src/server/models/basicTypes';

describe('Velocity', function() {
  describe('#VelocityTests', function() {
    it('Construct Velocity with just dest and speed', function() {
      const velocity: Velocity = new Velocity({ x: 3, y: 4 }, 1);
      assert.equal(1, velocity.speed);
      const unitVector: Vector = velocity.unitVector;
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: Vector = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Construct Velocity with all inputs', function() {
      const velocity: Velocity = new Velocity({ x: 4, y: 5 }, 1, { x: 1, y: 1 });
      assert.equal(1, velocity.speed);
      const unitVector: Vector = velocity.unitVector;
      assert.equal(0.6, unitVector.x);
      assert.equal(0.8, unitVector.y);
      const vector: Vector = velocity.getVector();
      assert.equal(0.6, vector.x);
      assert.equal(0.8, vector.y);
    });

    it('Unit vector of 0,0 is valid', function() {
      const velocity = new Velocity(new Point(0, 0), 0);
      assert.equal(0, velocity.speed);
      const vector: Vector = velocity.unitVector;
      assert.equal(0, vector.x);
      assert.equal(0, vector.y);
    });
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
  describe('Builder', function() {
    it('rotateCounterClockwise works as expected', function() {
      const vector: Vector = new Vector.Builder(1, 0)
        .rotateCounterClockWise(Math.PI / 2)
        .build();
      assert.equal(parseInt(vector.x.toFixed(2)), 0);
      assert.equal(parseInt(vector.y.toFixed(2)), 1);

      const vector2: Vector = Vector.Builder.createFromVector(vector)
        .rotateCounterClockWise(Math.PI / 2)
        .build();
      assert.equal(parseInt(vector2.x.toFixed(2)), -1);
      assert.equal(parseInt(vector2.y.toFixed(2)), 0);
    });
  });
});

